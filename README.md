# Gestão Seguros 360

Sistema web inicial para gestão de corretoras de seguros, com módulos de segurados, propostas, apólices, renovações, sinistros, comissões e CRM.

## Como abrir no VS Code

1. Extraia o ZIP.
2. Abra a pasta `gestao-seguros-360-limpo` no VS Code.
3. Confirme que na raiz aparecem: `package.json`, `index.html`, `src`, `vite.config.js`.
4. Rode:

```bash
npm install
npm run dev
```

## Testar build

```bash
npm run build
```

## Publicação no GitHub Pages

O projeto já possui workflow em `.github/workflows/deploy.yml`.

No GitHub, em `Settings > Pages`, selecione:

```txt
Source: GitHub Actions
```

Depois faça push na branch `main`.

## Supabase

O script inicial do banco está em:

```txt
supabase/schema.sql
```
