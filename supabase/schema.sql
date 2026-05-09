create extension if not exists "pgcrypto";

create table if not exists segurados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf_cnpj text,
  telefone text,
  email text,
  endereco text,
  data_nascimento date,
  tipo_pessoa text default 'Física',
  perfil_cliente text,
  observacoes text,
  status text default 'Lead',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists seguradoras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  contato_comercial text,
  email text,
  telefone text,
  ramos_atendidos text,
  comissao_padrao numeric(10,2),
  observacoes text,
  status text default 'Ativa',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists ramos_seguros (
  id uuid primary key default gen_random_uuid(),
  nome_seguro text not null,
  ramo_seguro text not null,
  seguradora_id uuid references seguradoras(id) on delete set null,
  coberturas_principais text,
  assistencias text,
  carencia text,
  valor_estimado numeric(12,2),
  comissao_percentual numeric(10,2),
  status text default 'Ativo',
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists propostas (
  id uuid primary key default gen_random_uuid(),
  segurado_id uuid references segurados(id) on delete cascade,
  ramo_seguro_id uuid references ramos_seguros(id) on delete set null,
  seguradora_id uuid references seguradoras(id) on delete set null,
  valor_premio numeric(12,2),
  forma_pagamento text,
  quantidade_parcelas integer,
  data_cotacao date default current_date,
  validade_proposta date,
  status text default 'Em análise',
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists apolices (
  id uuid primary key default gen_random_uuid(),
  numero_apolice text not null,
  segurado_id uuid references segurados(id) on delete cascade,
  seguradora_id uuid references seguradoras(id) on delete set null,
  ramo_seguro_id uuid references ramos_seguros(id) on delete set null,
  proposta_id uuid references propostas(id) on delete set null,
  inicio_vigencia date not null,
  fim_vigencia date not null,
  premio_liquido numeric(12,2),
  premio_total numeric(12,2),
  forma_pagamento text,
  status text default 'Vigente',
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists renovacoes (
  id uuid primary key default gen_random_uuid(),
  apolice_id uuid references apolices(id) on delete cascade,
  segurado_id uuid references segurados(id) on delete cascade,
  data_vencimento date not null,
  status_renovacao text default 'Pendente',
  data_primeiro_alerta date,
  data_segundo_alerta date,
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists sinistros (
  id uuid primary key default gen_random_uuid(),
  segurado_id uuid references segurados(id) on delete cascade,
  apolice_id uuid references apolices(id) on delete cascade,
  tipo_sinistro text,
  data_ocorrido date,
  status text default 'Aberto',
  observacoes text,
  documentos text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists comissoes (
  id uuid primary key default gen_random_uuid(),
  apolice_id uuid references apolices(id) on delete cascade,
  seguradora_id uuid references seguradoras(id) on delete set null,
  premio_liquido numeric(12,2),
  percentual_comissao numeric(10,2),
  valor_comissao numeric(12,2),
  status text default 'A receber',
  data_prevista date,
  data_recebimento date,
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists followups (
  id uuid primary key default gen_random_uuid(),
  segurado_id uuid references segurados(id) on delete cascade,
  ultimo_contato date,
  proximo_contato date,
  canal text,
  interesse text,
  observacoes text,
  status_lead text default 'Novo lead',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists documentos_comerciais (
  id uuid primary key default gen_random_uuid(),
  tipo_documento text not null,
  segurado_id uuid references segurados(id) on delete cascade,
  proposta_id uuid references propostas(id) on delete set null,
  apolice_id uuid references apolices(id) on delete set null,
  conteudo text,
  data_emissao date default current_date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
