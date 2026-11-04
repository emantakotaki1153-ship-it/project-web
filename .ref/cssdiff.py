import re, sys, json

def parse(path):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    rules, i, n = [], 0, len(s)
    def decls(body):
        out = []
        depth = 0; cur = ''
        for ch in body:
            if ch == '{': depth += 1
            if ch == '}': depth -= 1
            if ch == ';' and depth == 0:
                if cur.strip(): out.append(re.sub(r'\s+', ' ', cur.strip()))
                cur = ''
            else:
                cur += ch
        if depth == 0 and cur.strip(): out.append(re.sub(r'\s+', ' ', cur.strip(' }')))
        return out
    while i < n:
        j = s.find('{', i)
        if j < 0: break
        # find matching close
        depth = 0; k = j
        while k < n:
            if s[k] == '{': depth += 1
            elif s[k] == '}':
                depth -= 1
                if depth == 0: break
            k += 1
        sel = re.sub(r'\s+', ' ', s[i:j]).strip()
        body = s[j+1:k]
        if sel.startswith('@keyframes'):
            for m in re.finditer(r'([^{]+)\{([^}]*)\}', body):
                rules.append((f"{sel} {m.group(1).strip()}", decls('{'+m.group(2)+'}')))
        elif sel.startswith('@'):
            rules.append((sel, decls(body)))
        else:
            for one in [x.strip() for x in sel.split(',')]:
                rules.append((one, decls(body)))
        i = k + 1
    return rules

a = dict(parse(sys.argv[1])); b = dict(parse(sys.argv[2]))
print(f"rules: original={len(a)} current={len(b)}")
print("\n### SELECTORS REMOVED");  [print("  -", k, a[k]) for k in a if k not in b]
print("\n### SELECTORS ADDED");    [print("  +", k, b[k]) for k in b if k not in a]
print("\n### DECLARATION CHANGES (shared selectors)")
for k in a:
    if k in b and a[k] != b[k]:
        sa, sb = a[k], b[k]
        rem = [d for d in sa if d not in sb]; add = [d for d in sb if d not in sa]
        if rem or add:
            print(f"  {k}")
            for d in rem: print(f"      - {d}")
            for d in add: print(f"      + {d}")
