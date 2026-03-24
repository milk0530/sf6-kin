// コマンド文字列をアイコン表示に変換するコンポーネント

const NUMPAD = { '1':'↙','2':'↓','3':'↘','4':'←','5':'·','6':'→','7':'↖','8':'↑','9':'↗' };

// ボタンアイコン: [強度][種別] → ファイル名
const BTN_ICON = {
  '弱P': '/icons/icon_punch_l.png',
  '中P': '/icons/icon_punch_m.png',
  '強P': '/icons/icon_punch_h.png',
  '弱K': '/icons/icon_kick_l.png',
  '中K': '/icons/icon_kick_m.png',
  '強K': '/icons/icon_kick_h.png',
  'P':   '/icons/icon_punch.png',
  'K':   '/icons/icon_kick.png',
  '弱':  '/icons/modern_l.png',
  '中':  '/icons/modern_m.png',
  '強':  '/icons/modern_h.png',
};

// 方向矢印アイコン（白: 通常入力、黄: 溜めコマンド用）
const DIR_ICON = {
  '↙': '/icons/key-dl.png',
  '↓': '/icons/key-d.png',
  '↘': '/icons/key-dr.png',
  '←': '/icons/key-l.png',
  '→': '/icons/key-r.png',
  '↖': '/icons/key-ul.png',
  '↑': '/icons/key-u.png',
  '↗': '/icons/key-ur.png',
};

function tokenize(cmd) {
  const tokens = [];
  let i = 0;
  while (i < cmd.length) {
    // 全角カッコのコンテキスト
    if (cmd[i] === '（') {
      const end = cmd.indexOf('）', i);
      if (end !== -1) {
        tokens.push({ type: 'ctx', text: cmd.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // SA / CA バッジ（長いものから先に）
    if (cmd.startsWith('SA1H', i)) { tokens.push({ type: 'sa', text: 'SA1H' }); i += 4; continue; }
    if (cmd.startsWith('SA1',  i)) { tokens.push({ type: 'sa', text: 'SA1'  }); i += 3; continue; }
    if (cmd.startsWith('SA2',  i)) { tokens.push({ type: 'sa', text: 'SA2'  }); i += 3; continue; }
    if (cmd.startsWith('SA3',  i)) { tokens.push({ type: 'sa', text: 'SA3'  }); i += 3; continue; }
    if (cmd.startsWith('CA',   i)) { tokens.push({ type: 'sa', text: 'CA'   }); i += 2; continue; }

    // SP ボタン（モダン専用技ボタン）
    if (cmd.startsWith('SP', i)) { tokens.push({ type: 'sp' }); i += 2; continue; }

    // DI バッジ（ドライブインパクト）
    if (cmd.startsWith('DI', i)) { tokens.push({ type: 'di' }); i += 2; continue; }

    // DP バッジ（ドライブパリィ）
    if (cmd.startsWith('DP', i)) { tokens.push({ type: 'dp' }); i += 2; continue; }

    // AUTO バッジ
    if (cmd.startsWith('AUTO', i)) { tokens.push({ type: 'auto' }); i += 4; continue; }

    // J. ジャンプ修飾子
    if (cmd.startsWith('J.', i)) { tokens.push({ type: 'jmod' }); i += 2; continue; }

    // ボタン（長い組み合わせから先に）
    if (cmd.startsWith('弱P', i)) { tokens.push({ type: 'btn', s: '弱', t: 'P' }); i += 2; continue; }
    if (cmd.startsWith('中P', i)) { tokens.push({ type: 'btn', s: '中', t: 'P' }); i += 2; continue; }
    if (cmd.startsWith('強P', i)) { tokens.push({ type: 'btn', s: '強', t: 'P' }); i += 2; continue; }
    if (cmd.startsWith('弱K', i)) { tokens.push({ type: 'btn', s: '弱', t: 'K' }); i += 2; continue; }
    if (cmd.startsWith('中K', i)) { tokens.push({ type: 'btn', s: '中', t: 'K' }); i += 2; continue; }
    if (cmd.startsWith('強K', i)) { tokens.push({ type: 'btn', s: '強', t: 'K' }); i += 2; continue; }
    if (cmd[i] === '弱') { tokens.push({ type: 'btn', s: '弱', t: '' }); i++; continue; }
    if (cmd[i] === '中') { tokens.push({ type: 'btn', s: '中', t: '' }); i++; continue; }
    if (cmd[i] === '強') { tokens.push({ type: 'btn', s: '強', t: '' }); i++; continue; }

    // 方向矢印
    if ('↓↗↙↘↖→←↑'.includes(cmd[i])) { tokens.push({ type: 'dir', d: cmd[i] }); i++; continue; }

    // 数字（テンキー記法）
    if (/[0-9]/.test(cmd[i])) {
      let num = '';
      while (i < cmd.length && /[0-9]/.test(cmd[i])) { num += cmd[i]; i++; }
      for (const d of num) tokens.push({ type: 'numpad', d });
      continue;
    }

    // PまたはK単体
    if (cmd[i] === 'P') { tokens.push({ type: 'btn', s: null, t: 'P' }); i++; continue; }
    if (cmd[i] === 'K') { tokens.push({ type: 'btn', s: null, t: 'K' }); i++; continue; }

    // ● 汎用ボタン
    if (cmd[i] === '●') { tokens.push({ type: 'anybtn' }); i++; continue; }

    // N ニュートラル
    if (cmd[i] === 'N') { tokens.push({ type: 'neutral' }); i++; continue; }

    // 投げ
    if (cmd[i] === '投') { tokens.push({ type: 'throw' }); i++; continue; }

    // セパレータ
    if (cmd[i] === '+') { tokens.push({ type: 'plus' }); i++; continue; }
    if (cmd[i] === '▶') { tokens.push({ type: 'seq'  }); i++; continue; }

    // その他テキスト
    tokens.push({ type: 'txt', ch: cmd[i] });
    i++;
  }
  return tokens;
}

const IMG_STYLE = {
  display: 'inline-block',
  verticalAlign: 'middle',
  flexShrink: 0,
};

function CmdImg({ src, size = 22 }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      style={IMG_STYLE}
      draggable={false}
    />
  );
}

function BadgeImg({ src, h = 18 }) {
  return (
    <img
      src={src}
      height={h}
      style={{ ...IMG_STYLE, width: 'auto' }}
      draggable={false}
    />
  );
}

function Token({ tok }) {
  switch (tok.type) {
    case 'ctx':
      return (
        <span style={{ color: '#555', fontSize: 9, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
          {tok.text}
        </span>
      );

    case 'sa': {
      // SA badge + number suffix
      const num = tok.text.startsWith('CA') ? '' : tok.text.replace('SA', '');
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <BadgeImg src="/icons/badge-sa.png" h={18} />
          {num && (
            <span style={{
              fontSize: 8, fontWeight: 700, color: '#e879f9',
              marginLeft: 1, lineHeight: 1,
            }}>{num}</span>
          )}
        </span>
      );
    }

    case 'sp':
      return <BadgeImg src="/icons/modern_sp.png" h={18} />;

    case 'auto':
      return <BadgeImg src="/icons/modern_auto.png" h={18} />;

    case 'jmod':
      return (
        <span style={{
          display: 'inline-block', padding: '1px 4px', borderRadius: 3,
          background: '#1a1a2e', border: '1px solid #444',
          color: '#888', fontSize: 9, fontWeight: 700,
        }}>J</span>
      );

    case 'neutral':
      return <CmdImg src="/icons/key-nutral.png" size={22} />;

    case 'di':
      return <BadgeImg src="/icons/badge-di.png" h={18} />;

    case 'dp':
      return <BadgeImg src="/icons/badge-dp.png" h={18} />;

    case 'dir':
    case 'numpad': {
      const arrow = tok.type === 'numpad' ? (NUMPAD[tok.d] ?? tok.d) : tok.d;
      const src = DIR_ICON[arrow];
      if (src) return <CmdImg src={src} size={20} />;
      // '5' (ニュートラル) など矢印のないケース
      return (
        <span style={{ color: '#ccc', fontSize: 14, lineHeight: 1, fontFamily: 'monospace' }}>
          {arrow}
        </span>
      );
    }

    case 'btn': {
      const key = tok.s ? tok.s + tok.t : (tok.t || '');
      const src = BTN_ICON[key];
      if (src) return <CmdImg src={src} size={22} />;
      // フォールバック: テキスト表示
      const label = tok.s ? tok.s + tok.t : tok.t;
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: '#1a1a2e', border: '1.5px solid #555',
          color: '#999', fontSize: label.length <= 1 ? 11 : 8, fontWeight: 700,
        }}>{label}</span>
      );
    }

    case 'anybtn':
      return <CmdImg src="/icons/key-all.png" size={20} />;

    case 'throw':
      return (
        <span style={{
          display: 'inline-block', padding: '1px 5px', borderRadius: 3,
          background: '#0d2e1a', border: '1px solid #22c55e',
          color: '#86efac', fontSize: 9, fontWeight: 700,
        }}>投</span>
      );

    case 'plus':
      return <CmdImg src="/icons/key-plus.png" size={16} />;

    case 'seq':
      return <CmdImg src="/icons/seq.png" size={16} />;

    case 'txt':
      if (/[\s]/.test(tok.ch)) return null;
      return <span style={{ color: '#666', fontSize: 10 }}>{tok.ch}</span>;

    default:
      return null;
  }
}

function CommandLine({ line, dim }) {
  const tokens = tokenize(line);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      flexWrap: 'wrap', lineHeight: 1,
      opacity: dim ? 0.55 : 1,
    }}>
      {tokens.map((tok, i) => <Token key={i} tok={tok} />)}
    </span>
  );
}

export default function CommandRenderer({ command }) {
  if (!command || command === '-') {
    return <span style={{ color: '#444' }}>-</span>;
  }

  const lines = command.split('|');

  if (lines.length === 1) {
    return <CommandLine line={lines[0]} dim={false} />;
  }

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
      {lines.map((line, idx) => (
        <CommandLine key={idx} line={line} dim={idx > 0} />
      ))}
    </span>
  );
}
