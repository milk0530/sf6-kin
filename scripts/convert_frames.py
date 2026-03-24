import json, re

with open('C:/Users/81903/Documents/sf6-dood/frames_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_cmd(text):
    if not text: return ''
    # [modern_x] タグ前の冗長な 弱/中/強 を除去してから変換
    text = re.sub(r'(?:[弱中強]\s+)+(?=\[modern_)', '', text)
    text = re.sub(r'\[modern_l\]', '弱', text)
    text = re.sub(r'\[modern_m\]', '中', text)
    text = re.sub(r'\[modern_h\]', '強', text)
    text = re.sub(r'\[modern_auto\]', 'AUTO', text)
    text = re.sub(r'\[modern_sp\]', 'SP', text)
    text = re.sub(r'\[modern_dp\]', 'DP', text)
    text = re.sub(r'\[key-all\]', '●', text)
    text = text.replace('＋', '+').replace('＞', '▶')
    text = re.sub(r'\s+or\s+', '|', text)
    # SP の直後（空白含む）に方向矢印が続く場合は | で区切る（簡易入力と通常入力の分離）
    text = re.sub(r'(SP)\s*([↓↗↙↘↖→←↑])', r'\1|\2', text)
    # SP直後に強/中/弱ボタンが続く場合は + で繋ぐ（同時押し）
    text = re.sub(r'(SP)\s*([弱中強])(?![|↓↗↙↘↖→←↑])', r'\1+\2', text)
    parts = re.split(r'(（[^）]*）)', text)
    result = []
    for p in parts:
        if p.startswith('（'):
            result.append(p)
        else:
            result.append(re.sub(r'\s+', '', p))
    return ''.join(result)

def parse_name(text):
    if not text: return None, None
    text = str(text).strip()
    # 半角カッコ（モダン簡易入力の注釈）を除去
    text = re.sub(r'\([^)]*\)', '', text).strip()
    arrows = '↓↙←↗↖↘→↑'

    # 1) 技名に直付きの（）ニックネームを検出（スペースなしで始まる）
    inline_end = -1
    depth = 0
    for i, ch in enumerate(text):
        if ch == '（' and i > 0 and text[i-1] != ' ':
            depth += 1
        elif ch == '）' and depth > 0:
            depth -= 1
            if depth == 0:
                inline_end = i
    if inline_end >= 0:
        label = text[:inline_end+1].strip()
        cmd_raw = text[inline_end+1:].strip()
        if cmd_raw:
            cmd = clean_cmd(cmd_raw)
            label = re.sub(r'\s*\[modern_\w+\]', '', label).strip()
            label = re.sub(r'[\s＋+N]+$', '', label).strip()
            return label, cmd

    # 2) 方向記号 / 条件（） / ボタン列のうち最も前の位置で分割
    arrow_idx = next((i for i,c in enumerate(text) if c in arrows), -1)
    cond_idx  = next((i for i in range(1,len(text)) if text[i]=='（' and text[i-1]==' '), -1)
    bm = re.search(r'\s+([弱中強][PK])', text)
    btn_idx = bm.start() + 1 if bm else -1
    # モダン表記（[modern_x]が含まれる場合）は弱/中/強単体もコマンド開始と見なす
    bm2 = re.search(r'\s+([弱中強])(?![PK])', text) if '[modern_' in text else None
    btn_idx2 = bm2.start() + 1 if bm2 else -1
    candidates = [x for x in [arrow_idx, cond_idx, btn_idx, btn_idx2] if x >= 0]
    if not candidates:
        return text, ''
    split = min(candidates)
    label = text[:split].strip()
    cmd = clean_cmd(text[split:].strip())
    label = re.sub(r'\s*\[modern_\w+\]', '', label).strip()
    # コマンド記号（N・＋・+）のラベル末尾への混入を除去
    label = re.sub(r'[\s＋+N]+$', '', label).strip()
    return label, cmd

GROUPS = {'通常技', '特殊技', '必殺技', 'スーパーアーツ'}

def sheet_to_moves(sheet_rows):
    moves = []
    group = '通常技'
    for row in sheet_rows:
        v = row[0]
        if v is None: continue
        v = str(v)
        if v in GROUPS: group = v; continue
        if v == '技名' or v.startswith('キンバリー') or v.startswith('出典'): continue
        label, cmd = parse_name(v)
        if not label: continue
        def s(x):
            r = str(x).strip() if x is not None else None
            return None if r in (None, 'None', '') else r
        moves.append({
            'group': group, 'label': label, 'command': cmd,
            'startup': s(row[1]), 'active': s(row[2]), 'recovery': s(row[3]),
            'onHit': s(row[4]), 'onBlock': s(row[5]), 'cancel': s(row[6]),
            'damage': s(row[7]), 'attribute': s(row[13]), 'note': s(row[14]),
        })
    return moves

def fmt_adv(v):
    """ヒット/ガード有利: 正の数に + を付ける"""
    if v is None: return None
    v = str(v).strip()
    if v in ('None', '', 'D', 'ダウン'): return v
    try:
        n = float(v)
        if n > 0: return '+' + v
    except: pass
    return v

def jsstr(v):
    if v is None: return 'null'
    v = str(v).replace('\\', '\\\\').replace("'", "\\'")
    return "'" + v + "'"

def moves_to_js(moves, varname):
    lines = [f'  {varname}: [']
    for m in moves:
        # ジャンプ中コンテキストを J. に変換
        cmd = (m['command'] or '').replace('（前ジャンプ中に）', 'J.').replace('（ジャンプ中に）', 'J.')
        m = {**m, 'command': cmd,
             'onHit': fmt_adv(m['onHit']),
             'onBlock': fmt_adv(m['onBlock'])}
        parts = [f'{k}: {jsstr(m[k])}' for k in
            ['group','label','command','startup','active','recovery',
             'onHit','onBlock','cancel','damage','attribute','note']]
        lines.append('    { ' + ', '.join(parts) + ' },')
    lines.append('  ],')
    return '\n'.join(lines)

sheets = list(data.keys())
moves = sheet_to_moves(data[sheets[0]])
modern = sheet_to_moves(data[sheets[1]])

out = moves_to_js(moves, 'moves') + '\n\n' + moves_to_js(modern, 'modernMoves')
with open('C:/Users/81903/Documents/sf6-dood/frames_js.txt', 'w', encoding='utf-8') as f:
    f.write(out)
print(f'done: {len(moves)} classic, {len(modern)} modern moves')
