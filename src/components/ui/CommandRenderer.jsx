// コマンド文字列をアイコン表示に変換するコンポーネント

const NUMPAD = { '1':'↙','2':'↓','3':'↘','4':'←','5':'·','6':'→','7':'↖','8':'↑','9':'↗' };

// 方向アイコン（通常）
const DIR_ICON = {
  '↙': '/icons/dir-1.png',
  '↓': '/icons/dir-2w.png',
  '↘': '/icons/dir-3w.png',
  '←': '/icons/dir-4w.png',
  '→': '/icons/dir-6.png',
  '↖': '/icons/dir-7.png',
  '↑': '/icons/dir-8.png',
  '↗': '/icons/dir-9.png',
};

// 溜め方向アイコン（[4] [2] など）
const DIR_CHARGE_ICON = {
  '↓': '/icons/dir-2.png',
  '↘': '/icons/dir-3.png',
  '←': '/icons/dir-4.png',
};

// ボタンアイコン: 日本語表記・英語表記ともに対応
const BTN_ICON = {
  '弱P': '/icons/btn-lp.png', 'LP': '/icons/btn-lp.png',
  '中P': '/icons/btn-mp.png', 'MP': '/icons/btn-mp.png',
  '強P': '/icons/btn-hp.png', 'HP': '/icons/btn-hp.png',
  '弱K': '/icons/btn-lk.png', 'LK': '/icons/btn-lk.png',
  '中K': '/icons/btn-mk.png', 'MK': '/icons/btn-mk.png',
  '強K': '/icons/btn-hk.png', 'HK': '/icons/btn-hk.png',
  'P':   '/icons/btn-p.png',
  'K':   '/icons/btn-k.png',
  // Modern (日本語 and アルファベット)
  '弱':  '/icons/modern_l.png', 'L': '/icons/modern_l.png',
  '中':  '/icons/modern_m.png', 'M': '/icons/modern_m.png',
  '強':  '/icons/modern_h.png', 'H': '/icons/modern_h.png',
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
        i = end + 1; continue;
      }
    }

    // ── バッジ（長いものから先に） ──────────────────────────────
    if (cmd.startsWith('SA1H', i)) { tokens.push({ type: 'sa', text: 'SA1H' }); i += 4; continue; }
    if (cmd.startsWith('SA1',  i)) { tokens.push({ type: 'sa', text: 'SA1'  }); i += 3; continue; }
    if (cmd.startsWith('SA2',  i)) { tokens.push({ type: 'sa', text: 'SA2'  }); i += 3; continue; }
    if (cmd.startsWith('SA3',  i)) { tokens.push({ type: 'sa', text: 'SA3'  }); i += 3; continue; }
    if (cmd.startsWith('CA',   i)) { tokens.push({ type: 'sa', text: 'CA'   }); i += 2; continue; }
    if (cmd.startsWith('OD',   i)) { tokens.push({ type: 'od'               }); i += 2; continue; }
    if (cmd.startsWith('DASH', i)) { tokens.push({ type: 'dash'             }); i += 4; continue; }
    if (cmd.startsWith('AUTO', i)) { tokens.push({ type: 'auto'             }); i += 4; continue; }
    if (cmd.startsWith('ANY',  i)) { tokens.push({ type: 'anybtn'           }); i += 3; continue; }
    if (cmd.startsWith('3x',   i)) { tokens.push({ type: 'tri'              }); i += 2; continue; }

    // ── モーションショートカット ──────────────────────────────
    if (cmd.startsWith('QCF', i)) { tokens.push({ type: 'motion', m: 'qcf' }); i += 3; continue; }
    if (cmd.startsWith('QCB', i)) { tokens.push({ type: 'motion', m: 'qcb' }); i += 3; continue; }
    if (cmd.startsWith('360', i)) { tokens.push({ type: 'motion', m: '360' }); i += 3; continue; }

    // ── その他バッジ ──────────────────────────────────────────
    if (cmd.startsWith('SP',   i)) { tokens.push({ type: 'sp'  }); i += 2; continue; }
    if (cmd.startsWith('DI',   i)) { tokens.push({ type: 'di'  }); i += 2; continue; }
    if (cmd.startsWith('DP',   i)) { tokens.push({ type: 'dp'  }); i += 2; continue; }
    if (cmd.startsWith('J.',   i)) { tokens.push({ type: 'jmod'}); i += 2; continue; }

    // ── ボタン: 英語表記（LP/MP/HP/LK/MK/HK） ──────────────────
    if (cmd.startsWith('LP', i)) { tokens.push({ type: 'btn', key: 'LP' }); i += 2; continue; }
    if (cmd.startsWith('MP', i)) { tokens.push({ type: 'btn', key: 'MP' }); i += 2; continue; }
    if (cmd.startsWith('HP', i)) { tokens.push({ type: 'btn', key: 'HP' }); i += 2; continue; }
    if (cmd.startsWith('LK', i)) { tokens.push({ type: 'btn', key: 'LK' }); i += 2; continue; }
    if (cmd.startsWith('MK', i)) { tokens.push({ type: 'btn', key: 'MK' }); i += 2; continue; }
    if (cmd.startsWith('HK', i)) { tokens.push({ type: 'btn', key: 'HK' }); i += 2; continue; }

    // ── モダン L/M/H 単体（LP/MP/HP/LK/MK/HK より後） ────────
    if (cmd[i] === 'L' && !/[PKK]/.test(cmd[i+1] ?? '')) { tokens.push({ type: 'btn', key: 'L' }); i++; continue; }
    if (cmd[i] === 'M' && !/[PK]/.test(cmd[i+1] ?? ''))  { tokens.push({ type: 'btn', key: 'M' }); i++; continue; }
    if (cmd[i] === 'H' && !/[PK]/.test(cmd[i+1] ?? ''))  { tokens.push({ type: 'btn', key: 'H' }); i++; continue; }

    // ── ボタン: 日本語表記 ────────────────────────────────────
    if (cmd.startsWith('弱P', i)) { tokens.push({ type: 'btn', key: '弱P' }); i += 2; continue; }
    if (cmd.startsWith('中P', i)) { tokens.push({ type: 'btn', key: '中P' }); i += 2; continue; }
    if (cmd.startsWith('強P', i)) { tokens.push({ type: 'btn', key: '強P' }); i += 2; continue; }
    if (cmd.startsWith('弱K', i)) { tokens.push({ type: 'btn', key: '弱K' }); i += 2; continue; }
    if (cmd.startsWith('中K', i)) { tokens.push({ type: 'btn', key: '中K' }); i += 2; continue; }
    if (cmd.startsWith('強K', i)) { tokens.push({ type: 'btn', key: '強K' }); i += 2; continue; }
    if (cmd[i] === '弱') { tokens.push({ type: 'btn', key: '弱' }); i++; continue; }
    if (cmd[i] === '中') { tokens.push({ type: 'btn', key: '中' }); i++; continue; }
    if (cmd[i] === '強') { tokens.push({ type: 'btn', key: '強' }); i++; continue; }

    // ── 方向矢印（直接入力） ──────────────────────────────────
    if ('↓↗↙↘↖→←↑'.includes(cmd[i])) {
      tokens.push({ type: 'dir', d: cmd[i] }); i++; continue;
    }

    // ── 数字（テンキー表記） ───────────────────────────────────
    if (/[0-9]/.test(cmd[i])) {
      let num = '';
      while (i < cmd.length && /[0-9]/.test(cmd[i])) { num += cmd[i]; i++; }
      for (const d of num) {
        if (d === '5') tokens.push({ type: 'neutral' });
        else tokens.push({ type: 'numpad', d });
      }
      continue;
    }

    // ── 溜め入力 [4] [2] [↓] など ────────────────────────────
    if (cmd[i] === '[') {
      const end = cmd.indexOf(']', i + 1);
      if (end !== -1) {
        const inner = cmd.slice(i + 1, end);
        if (inner.length === 1 && (/[1-9]/.test(inner) || '↙↓↘←→↖↑↗'.includes(inner))) {
          const arrow = /[1-9]/.test(inner) ? (NUMPAD[inner] ?? inner) : inner;
          tokens.push({ type: 'charge', d: arrow });
          i = end + 1; continue;
        }
      }
    }

    // ── P / K 単体 ────────────────────────────────────────────
    if (cmd[i] === 'P') { tokens.push({ type: 'btn', key: 'P' }); i++; continue; }
    if (cmd[i] === 'K') { tokens.push({ type: 'btn', key: 'K' }); i++; continue; }

    // ── その他 ───────────────────────────────────────────────
    if (cmd[i] === '●') { tokens.push({ type: 'anybtn'  }); i++; continue; }
    if (cmd[i] === 'N') { tokens.push({ type: 'neutral' }); i++; continue; }
    if (cmd[i] === '投') { tokens.push({ type: 'throw'  }); i++; continue; }
    if (cmd[i] === '+') { tokens.push({ type: 'plus'    }); i++; continue; }
    if (cmd[i] === '▶') { tokens.push({ type: 'seq'     }); i++; continue; }
    if (cmd[i] === '>') { tokens.push({ type: 'seq'     }); i++; continue; }

    if (/[\s]/.test(cmd[i])) { i++; continue; } // スペースは無視

    tokens.push({ type: 'txt', ch: cmd[i] });
    i++;
  }
  return tokens;
}

const IMG_STYLE = { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 };

function CmdImg({ src, size = 22, mono = false }) {
  return (
    <img
      src={src} width={size} height={size}
      style={{ ...IMG_STYLE, filter: mono ? 'var(--cmd-icon-filter)' : undefined }}
      draggable={false}
    />
  );
}

function BadgeImg({ src, h = 18 }) {
  return (
    <img src={src} height={h} style={{ ...IMG_STYLE, width: 'auto' }} draggable={false} />
  );
}

function Token({ tok }) {
  switch (tok.type) {
    case 'ctx':
      return <span style={{ color: 'var(--text-4)', fontSize: 9, fontStyle: 'italic', whiteSpace: 'nowrap' }}>{tok.text}</span>;

    case 'sa': {
      const num = tok.text.startsWith('CA') ? '' : tok.text.replace('SA', '');
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <BadgeImg src="/icons/badge-sa.png" h={18} />
          {num && <span style={{ fontSize: 8, fontWeight: 700, color: '#e879f9', marginLeft: 1, lineHeight: 1 }}>{num}</span>}
        </span>
      );
    }

    case 'od':
      return <BadgeImg src="/icons/badge-od.png" h={18} />;

    case 'dash':
      return <BadgeImg src="/icons/badge-dash.png" h={18} />;

    case 'tri':
      return <BadgeImg src="/icons/badge-3x.png" h={18} />;

    case 'sp':
      return <BadgeImg src="/icons/modern_sp.png" h={18} />;

    case 'auto':
      return <BadgeImg src="/icons/modern_auto.png" h={18} />;

    case 'di':
      return <BadgeImg src="/icons/badge-di.png" h={18} />;

    case 'dp':
      return <BadgeImg src="/icons/badge-dp.png" h={18} />;

    case 'motion': {
      const src = {
        qcf: '/icons/motion-qcf.png',
        qcb: '/icons/motion-qcf.png', // 反転なし、テキストフォールバック
        '360': '/icons/motion-360.png',
      }[tok.m];
      if (tok.m === 'qcb') {
        return (
          <img src="/icons/motion-qcf.png" height={18}
            style={{ ...IMG_STYLE, width: 'auto', transform: 'scaleX(-1)', filter: 'var(--cmd-icon-filter)' }}
            draggable={false}
          />
        );
      }
      return src ? <BadgeImg src={src} h={18} /> : null;
    }

    case 'jmod':
      return (
        <span style={{
          display: 'inline-block', padding: '1px 4px', borderRadius: 3,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          color: 'var(--text-3)', fontSize: 9, fontWeight: 700,
        }}>J</span>
      );

    case 'neutral':
      return <CmdImg src="/icons/neutral.png" size={20} mono />;

    case 'dir':
    case 'numpad': {
      const arrow = tok.type === 'numpad' ? (NUMPAD[tok.d] ?? tok.d) : tok.d;
      const src = DIR_ICON[arrow];
      if (src) return <CmdImg src={src} size={20} mono />;
      return <span style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1, fontFamily: 'monospace' }}>{arrow}</span>;
    }

    case 'charge': {
      const src = DIR_CHARGE_ICON[tok.d] ?? DIR_ICON[tok.d];
      if (src) return <CmdImg src={src} size={20} mono />;
      return <span style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1, fontFamily: 'monospace' }}>[{tok.d}]</span>;
    }

    case 'btn': {
      const src = BTN_ICON[tok.key];
      if (src) return <CmdImg src={src} size={22} />;
      return (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: 'var(--bg-elevated)', border: '1.5px solid var(--border)',
          color: 'var(--text-3)', fontSize: tok.key.length <= 1 ? 11 : 8, fontWeight: 700,
        }}>{tok.key}</span>
      );
    }

    case 'anybtn':
      return <CmdImg src="/icons/circle-any.png" size={22} />;

    case 'throw':
      return (
        <span style={{
          display: 'inline-block', padding: '1px 5px', borderRadius: 3,
          background: '#0d2e1a', border: '1px solid #22c55e',
          color: '#86efac', fontSize: 9, fontWeight: 700,
        }}>投</span>
      );

    case 'plus':
      return <CmdImg src="/icons/plus.png" size={16} mono />;

    case 'seq':
      return <CmdImg src="/icons/seq.png" size={16} mono />;

    case 'txt':
      return <span style={{ color: 'var(--text-4)', fontSize: 10 }}>{tok.ch}</span>;

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
    return <span style={{ color: 'var(--text-5)' }}>-</span>;
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
