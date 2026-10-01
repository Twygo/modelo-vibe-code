---
name: importar-planilha
description: Implementa upload e importação de planilha CSV ou XLSX no kpi-boilerplate, com validação linha a linha e mensagens de erro em português. Use quando o usuário pedir "quero subir uma planilha", "importar CSV/Excel", "carregar os dados do arquivo X", "botão de upload".
---

# Importar planilha (CSV/XLSX)

Padrão recomendado: **o backend lê e valida** (o arquivo não fica salvo em disco, e as
regras ficam num lugar só). Já estão instalados: `python-multipart` (upload) e `openpyxl`
(XLSX). Não instale nada novo.

## 0. Combine com a pessoa

- Quais colunas a planilha tem (nomes exatos do cabeçalho) e quais são obrigatórias.
- Tipo de cada coluna (texto, número, data `dd/mm/aaaa`, percentual).
- O que fazer ao importar de novo: **substituir tudo** ou **acrescentar**?
- **LGPD:** a planilha tem dados pessoais (nome, CPF, salário, e-mail...)? Se sim, só com
  autorização. Para testar, gere uma planilha fictícia. Arquivos reais ficam na pasta
  `dados/` (ignorada pelo Git) ou fora do projeto — **nunca** faça commit deles.

## 1. Backend — endpoint de importação

Em `backend/app/routers/<slug>.py` (crie o router como na skill `nova-pagina-kpi` se ainda
não existir):

```python
import csv
import io
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from openpyxl import load_workbook
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app import models
from app.db import get_db

router = APIRouter(prefix="/api/<slug>", tags=["<slug>"])

REQUIRED = ["area", "mes", "headcount"]  # cabeçalhos obrigatórios (minúsculos)
MAX_BYTES = 5 * 1024 * 1024               # 5 MB


def _read_rows(filename: str, content: bytes) -> list[dict[str, str]]:
    name = filename.lower()
    if name.endswith(".csv"):
        text = content.decode("utf-8-sig", errors="replace")
        dialect = csv.Sniffer().sniff(text[:2048], delimiters=",;")  # Excel BR usa ";"
        reader = csv.DictReader(io.StringIO(text), dialect=dialect)
        return [{(k or "").strip().lower(): (v or "").strip() for k, v in r.items()} for r in reader]
    if name.endswith(".xlsx"):
        ws = load_workbook(io.BytesIO(content), read_only=True, data_only=True).active
        rows = list(ws.iter_rows(values_only=True))
        if not rows:
            return []
        header = [str(h or "").strip().lower() for h in rows[0]]
        return [
            {header[i]: ("" if v is None else str(v).strip()) for i, v in enumerate(r) if i < len(header)}
            for r in rows[1:]
            if any(v not in (None, "") for v in r)
        ]
    raise HTTPException(400, "Formato não suportado. Envie um arquivo .csv ou .xlsx.")


def _to_float(value: str) -> float:
    # aceita "1.234,56" e "1234.56"
    v = value.replace("%", "").replace("R$", "").strip()
    if "," in v:
        v = v.replace(".", "").replace(",", ".")
    return float(v)


def _to_date(value: str):
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%m/%Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            pass
    raise ValueError


@router.post("/importar")
async def importar(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(400, "Arquivo maior que 5 MB.")
    rows = _read_rows(file.filename or "", content)
    if not rows:
        raise HTTPException(400, "A planilha está vazia.")

    missing = [c for c in REQUIRED if c not in rows[0]]
    if missing:
        raise HTTPException(400, f"Faltam as colunas: {', '.join(missing)}.")

    errors: list[str] = []
    valid = []
    for i, r in enumerate(rows, start=2):  # linha 1 é o cabeçalho
        try:
            if not r["area"]:
                raise ValueError("área vazia")
            valid.append(
                models.<Model>(area=r["area"], period=_to_date(r["mes"]), headcount=_to_float(r["headcount"]))
            )
        except (ValueError, KeyError) as e:
            errors.append(f"Linha {i}: valor inválido ({e or 'formato'}).")

    if errors:
        # Não grava nada se houver erro: a pessoa corrige a planilha e envia de novo.
        raise HTTPException(422, " ".join(errors[:20]) + (" ..." if len(errors) > 20 else ""))

    db.execute(delete(models.<Model>))  # modo "substituir tudo" (remova para acrescentar)
    db.add_all(valid)
    db.commit()
    return {"importadas": len(valid)}
```

Adapte `REQUIRED`, as conversões e o model. Registre o router em `backend/app/main.py`
se for novo. Tabela nova → criada ao reiniciar; tabela alterada → `make reset`.

## 2. Frontend — botão de upload

Na página (`frontend/src/pages/<Nome>.tsx`):

```tsx
import { useState } from "react";
import { api, useApi } from "../lib/api";

const [status, setStatus] = useState<string | null>(null);
const [uploadError, setUploadError] = useState<string | null>(null);
const { data, reload } = useApi<...>("/api/<slug>");

async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  e.target.value = "";               // permite reenviar o mesmo arquivo
  if (!file) return;
  setStatus("Importando…");
  setUploadError(null);
  try {
    const res = await api.upload<{ importadas: number }>("/api/<slug>/importar", file);
    setStatus(`${res.importadas} linhas importadas.`);
    reload();
  } catch (err) {
    setStatus(null);
    setUploadError(err instanceof Error ? err.message : String(err));
  }
}

// no JSX:
<label className="btn">
  Importar planilha (.csv ou .xlsx)
  <input type="file" accept=".csv,.xlsx" hidden onChange={onFile} />
</label>
{status && <div className="state-card">{status}</div>}
{uploadError && <div className="state-card state-card--error">{uploadError}</div>}
```

## 3. Testar

1. Crie uma planilha **fictícia** de exemplo em `dados/exemplo-<slug>.csv` (pasta ignorada
   pelo Git) com 3–5 linhas, incluindo uma linha com erro proposital.
2. Teste pelo terminal: `curl -s -F "file=@dados/exemplo-<slug>.csv" http://localhost:8000/api/<slug>/importar`
   — deve devolver o erro da linha ruim em português; corrija e confira `{"importadas": N}`.
3. Diga para a pessoa abrir http://localhost:5173/<slug>, clicar em "Importar planilha" e
   escolher o arquivo. Explique as colunas esperadas.

Alternativa só no frontend (sem gravar no banco): ler CSV com `file.text()` e separar por
linha/`;`. Use só para pré-visualização; para XLSX prefira o backend (não adicione libs de
planilha no frontend).
