import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LayoutDashboard,
  UsersRound,
  ClipboardList,
  FileCheck2,
  RefreshCcw,
  AlertTriangle,
  BadgeDollarSign,
  Handshake,
  PhoneCall,
  Plus,
  Search,
  TrendingUp,
  CalendarClock,
  WalletCards,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { supabase } from "./lib/supabaseClient";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "segurados", label: "Segurados", icon: UsersRound },
  { id: "propostas", label: "Propostas", icon: ClipboardList },
  { id: "apolices", label: "Apólices", icon: FileCheck2 },
  { id: "renovacoes", label: "Renovações", icon: RefreshCcw },
  { id: "sinistros", label: "Sinistros", icon: AlertTriangle },
  { id: "comissoes", label: "Comissões", icon: BadgeDollarSign },
  { id: "seguradoras", label: "Seguradoras", icon: Handshake },
  { id: "crm", label: "CRM / Follow-up", icon: PhoneCall },
];

const seguradosMock = [
  {
    id: "mock-1",
    nome: "Mariana Oliveira",
    cpf_cnpj: "123.456.789-00",
    telefone: "(11) 99999-1010",
    email: "mariana@email.com",
    status: "Ativo",
    perfil_cliente: "Seguro Auto",
    tipo_pessoa: "Física",
  },
  {
    id: "mock-2",
    nome: "Construtora Norte LTDA",
    cpf_cnpj: "12.345.678/0001-90",
    telefone: "(11) 3333-2020",
    email: "financeiro@construtora.com",
    status: "Renovação",
    perfil_cliente: "Riscos de Engenharia",
    tipo_pessoa: "Jurídica",
  },
  {
    id: "mock-3",
    nome: "Lucas Pereira",
    cpf_cnpj: "987.654.321-00",
    telefone: "(11) 98888-3030",
    email: "lucas@email.com",
    status: "Lead",
    perfil_cliente: "Seguro Vida",
    tipo_pessoa: "Física",
  },
];

const propostas = [
  {
    cliente: "Mariana Oliveira",
    seguro: "Seguro Auto",
    seguradora: "Tokio Marine",
    premio: 2480,
    status: "Aceita",
  },
  {
    cliente: "Lucas Pereira",
    seguro: "Seguro Vida",
    seguradora: "Porto Seguro",
    premio: 960,
    status: "Enviada",
  },
  {
    cliente: "Construtora Norte LTDA",
    seguro: "Riscos de Engenharia",
    seguradora: "Tokio Marine",
    premio: 76200,
    status: "Em análise",
  },
];

const apolices = [
  {
    numero: "AP-2026-0001",
    cliente: "Mariana Oliveira",
    seguro: "Seguro Auto",
    fim: "2027-01-10",
    premio: 2480,
    status: "Vigente",
  },
  {
    numero: "AP-2025-0088",
    cliente: "Construtora Norte LTDA",
    seguro: "Riscos de Engenharia",
    fim: "2026-05-25",
    premio: 82100,
    status: "A vencer",
  },
];

const comissoes = [
  {
    apolice: "AP-2026-0001",
    seguradora: "Tokio Marine",
    premioLiquido: 2100,
    percentual: 12,
    status: "Recebida",
  },
  {
    apolice: "AP-2025-0088",
    seguradora: "Tokio Marine",
    premioLiquido: 76000,
    percentual: 10,
    status: "A receber",
  },
];

const chartReceita = [
  { mes: "Jan", receita: 12000, comissao: 2500 },
  { mes: "Fev", receita: 18000, comissao: 3600 },
  { mes: "Mar", receita: 16000, comissao: 3100 },
  { mes: "Abr", receita: 24000, comissao: 5200 },
  { mes: "Mai", receita: 35600, comissao: 10400 },
];

const chartStatus = [
  { status: "Em análise", total: 7 },
  { status: "Enviada", total: 12 },
  { status: "Aceita", total: 9 },
  { status: "Recusada", total: 3 },
];

function moeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function badgeClass(status) {
  const classes = {
    Ativo: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Vigente: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Aceita: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Recebida: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Lead: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    Enviada: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    "Em análise": "bg-amber-500/15 text-amber-300 border-amber-400/30",
    Renovação: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    "A vencer": "bg-orange-500/15 text-orange-300 border-orange-400/30",
    "A receber": "bg-orange-500/15 text-orange-300 border-orange-400/30",
    Pendente: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    Inativo: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  };

  return classes[status] || "bg-white/10 text-slate-300 border-white/20";
}

function Badge({ children }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
        children
      )}`}
    >
      {children || "Não informado"}
    </span>
  );
}

function Card({ title, value, detail, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-black text-white">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>

        <div className="rounded-2xl bg-cyan-400 p-3 text-slate-950 shadow-lg shadow-cyan-500/20">
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

function Header({ title, subtitle, button, onButtonClick }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
          <ShieldCheck size={14} />
          Gestão Seguros 360
        </div>

        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>
      </div>

      {button && (
        <button
          type="button"
          onClick={onButtonClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
        >
          <Plus size={18} />
          {button}
        </button>
      )}
    </div>
  );
}

function SearchBox({ placeholder }) {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-slate-300">
      <Search size={18} className="text-slate-500" />
      <input
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        placeholder={placeholder}
      />
    </div>
  );
}

function Dashboard({ seguradosLista }) {
  const totalComissoes = comissoes.reduce(
    (soma, item) => soma + (item.premioLiquido * item.percentual) / 100,
    0
  );

  const receita = apolices.reduce((soma, item) => soma + item.premio, 0);

  const totalLeads = seguradosLista.filter(
    (item) => item.status === "Lead"
  ).length;

  const totalAtivos = seguradosLista.filter(
    (item) => item.status === "Ativo"
  ).length;

  return (
    <div>
      <Header
        title="Dashboard Gerencial"
        subtitle="Visão executiva da carteira de seguros, propostas, apólices, renovações e comissões."
        button="Nova proposta"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Segurados" value={seguradosLista.length} detail="Clientes e leads cadastrados" icon={UsersRound} />
        <Card title="Leads" value={totalLeads} detail="Possíveis clientes em prospecção" icon={UsersRound} />
        <Card title="Clientes ativos" value={totalAtivos} detail="Segurados com relacionamento ativo" icon={ShieldCheck} />
        <Card title="Propostas" value={propostas.length} detail="Cotações em andamento" icon={ClipboardList} />
        <Card title="Apólices" value={apolices.length} detail="Contratos registrados" icon={FileCheck2} />
        <Card title="Comissões" value={moeda(totalComissoes)} detail="Previsão calculada" icon={BadgeDollarSign} />
        <Card title="Receita estimada" value={moeda(receita)} detail="Prêmio total em apólices" icon={TrendingUp} />
        <Card title="Apólices a vencer" value="1" detail="Prioridade de renovação" icon={CalendarClock} />
        <Card title="Comissões recebidas" value={moeda(252)} detail="Valores confirmados" icon={WalletCards} />
        <Card title="Sinistros abertos" value="2" detail="Ocorrências em acompanhamento" icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl">
          <h3 className="font-bold text-white">Receita e comissões</h3>
          <p className="mb-4 text-sm text-slate-400">Evolução mensal estimada</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartReceita}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                  formatter={(value) => moeda(value)}
                />
                <Area type="monotone" dataKey="receita" stroke="#22d3ee" fill="#22d3ee33" strokeWidth={3} />
                <Area type="monotone" dataKey="comissao" stroke="#a78bfa" fill="#a78bfa33" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl">
          <h3 className="font-bold text-white">Status das propostas</h3>
          <p className="mb-4 text-sm text-slate-400">Funil comercial por etapa</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" fill="#22d3ee" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabelaSegurados({
  seguradosLista,
  loading,
  erro,
  mostrarFormulario,
  setMostrarFormulario,
  formSegurado,
  setFormSegurado,
  salvandoSegurado,
  mensagemFormulario,
  salvarSegurado,
}) {
  function atualizarCampo(campo, valor) {
    setFormSegurado((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  return (
    <div>
      <Header
        title="Clientes / Segurados"
        subtitle="Cadastro de leads, clientes ativos, clientes em renovação e inativos."
        button="Novo segurado"
        onButtonClick={() => setMostrarFormulario(true)}
      />

      {mostrarFormulario && (
        <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-white/[0.06] p-5 shadow-2xl">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Novo segurado</h3>
              <p className="text-sm text-slate-400">
                Cadastre um lead, cliente ativo ou cliente em renovação.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.1]"
            >
              Fechar
            </button>
          </div>

          {mensagemFormulario && (
            <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-200">
              {mensagemFormulario}
            </div>
          )}

          <form onSubmit={salvarSegurado} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Nome" value={formSegurado.nome} onChange={(v) => atualizarCampo("nome", v)} required placeholder="Nome completo ou razão social" />
            <Input label="CPF/CNPJ" value={formSegurado.cpf_cnpj} onChange={(v) => atualizarCampo("cpf_cnpj", v)} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
            <Input label="Telefone" value={formSegurado.telefone} onChange={(v) => atualizarCampo("telefone", v)} placeholder="(11) 99999-9999" />
            <Input label="E-mail" type="email" value={formSegurado.email} onChange={(v) => atualizarCampo("email", v)} placeholder="cliente@email.com" />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Tipo de pessoa</label>
              <select
                value={formSegurado.tipo_pessoa}
                onChange={(e) => atualizarCampo("tipo_pessoa", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/60"
              >
                <option value="Física">Física</option>
                <option value="Jurídica">Jurídica</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={formSegurado.status}
                onChange={(e) => atualizarCampo("status", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/60"
              >
                <option value="Lead">Lead</option>
                <option value="Ativo">Ativo</option>
                <option value="Renovação">Renovação</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <Input label="Perfil / Interesse" value={formSegurado.perfil_cliente} onChange={(v) => atualizarCampo("perfil_cliente", v)} placeholder="Seguro Auto, Vida, Empresarial..." />
            <Input label="Endereço" value={formSegurado.endereco} onChange={(v) => atualizarCampo("endereco", v)} placeholder="Cidade, bairro ou endereço completo" />
            <Input label="Data de nascimento" type="date" value={formSegurado.data_nascimento} onChange={(v) => atualizarCampo("data_nascimento", v)} />

            <div className="md:col-span-2 xl:col-span-3">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Observações</label>
              <textarea
                value={formSegurado.observacoes}
                onChange={(e) => atualizarCampo("observacoes", e.target.value)}
                placeholder="Observações comerciais, histórico inicial, preferências ou informações importantes..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <button
                type="submit"
                disabled={salvandoSegurado}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />
                {salvandoSegurado ? "Salvando..." : "Salvar segurado"}
              </button>
            </div>
          </form>
        </div>
      )}

      <SearchBox placeholder="Buscar por nome, CPF/CNPJ, telefone, e-mail ou status..." />

      {loading && (
        <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-200">
          Carregando segurados do Supabase...
        </div>
      )}

      {erro && (
        <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {erro}
        </div>
      )}

      {!loading && seguradosLista.length === 0 && (
        <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Nenhum segurado encontrado. Cadastre dados no Supabase para aparecerem aqui.
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Nome</th>
                <th className="px-5 py-4">CPF/CNPJ</th>
                <th className="px-5 py-4">Contato</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Perfil / Interesse</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 text-slate-200">
              {seguradosLista.map((item) => (
                <tr key={item.id || item.cpf_cnpj || item.email} className="hover:bg-white/[0.04]">
                  <td className="px-5 py-4 font-semibold text-white">{item.nome || "Sem nome"}</td>
                  <td className="px-5 py-4">{item.cpf_cnpj || "Não informado"}</td>
                  <td className="px-5 py-4">
                    <div>{item.telefone || "Sem telefone"}</div>
                    <div className="text-xs text-slate-500">{item.email || "Sem e-mail"}</div>
                  </td>
                  <td className="px-5 py-4">{item.tipo_pessoa || "Não informado"}</td>
                  <td className="px-5 py-4">{item.perfil_cliente || "Não informado"}</td>
                  <td className="px-5 py-4"><Badge>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60"
      />
    </div>
  );
}

function TabelaPropostas() {
  return (
    <div>
      <Header
        title="Propostas / Cotações"
        subtitle="Controle das cotações feitas para clientes antes da emissão da apólice."
        button="Nova cotação"
      />

      <SearchBox placeholder="Buscar proposta por cliente, seguro, seguradora ou status..." />

      <div className="grid gap-4 lg:grid-cols-3">
        {propostas.map((item) => (
          <div
            key={`${item.cliente}-${item.seguro}`}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">{item.cliente}</h3>
                <p className="text-sm text-slate-400">{item.seguro}</p>
              </div>
              <Badge>{item.status}</Badge>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <p>
                Seguradora: <span className="font-semibold text-white">{item.seguradora}</span>
              </p>
              <p>
                Valor do prêmio: <span className="font-semibold text-white">{moeda(item.premio)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuloSimples({ title, subtitle }) {
  return (
    <div>
      <Header title={title} subtitle={subtitle} button="Novo registro" />

      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-10 text-center shadow-2xl">
        <ShieldCheck className="mx-auto text-cyan-300" size={48} />
        <h3 className="mt-4 text-xl font-bold text-white">Módulo preparado para expansão</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Esta tela já está reservada no sistema. O próximo passo será conectar formulários, Supabase e regras de negócio específicas para este módulo.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [seguradosData, setSeguradosData] = useState([]);
  const [loadingSegurados, setLoadingSegurados] = useState(false);
  const [erroSegurados, setErroSegurados] = useState("");
  const [mostrarFormularioSegurado, setMostrarFormularioSegurado] = useState(false);
  const [salvandoSegurado, setSalvandoSegurado] = useState(false);
  const [mensagemFormulario, setMensagemFormulario] = useState("");

  const [formSegurado, setFormSegurado] = useState({
    nome: "",
    cpf_cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    data_nascimento: "",
    tipo_pessoa: "Física",
    perfil_cliente: "",
    observacoes: "",
    status: "Lead",
  });

  async function carregarSegurados() {
    setLoadingSegurados(true);
    setErroSegurados("");

    if (!supabase) {
      setErroSegurados(
        "Supabase não configurado. Usando dados de exemplo. Confira o arquivo .env.local."
      );
      setSeguradosData(seguradosMock);
      setLoadingSegurados(false);
      return;
    }

    const { data, error } = await supabase
      .from("segurados")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar segurados:", error);
      setErroSegurados(
        "Não foi possível carregar os segurados do Supabase. Usando dados de exemplo."
      );
      setSeguradosData(seguradosMock);
    } else {
      setSeguradosData(data || []);
    }

    setLoadingSegurados(false);
  }

  useEffect(() => {
    carregarSegurados();
  }, []);

  async function salvarSegurado(event) {
    event.preventDefault();
    setMensagemFormulario("");

    if (!formSegurado.nome.trim()) {
      setMensagemFormulario("Informe o nome do segurado.");
      return;
    }

    if (!supabase) {
      setMensagemFormulario("Supabase não configurado. Não foi possível salvar no banco.");
      return;
    }

    setSalvandoSegurado(true);

    const payload = {
      nome: formSegurado.nome.trim(),
      cpf_cnpj: formSegurado.cpf_cnpj.trim() || null,
      telefone: formSegurado.telefone.trim() || null,
      email: formSegurado.email.trim() || null,
      endereco: formSegurado.endereco.trim() || null,
      data_nascimento: formSegurado.data_nascimento || null,
      tipo_pessoa: formSegurado.tipo_pessoa || "Física",
      perfil_cliente: formSegurado.perfil_cliente.trim() || null,
      observacoes: formSegurado.observacoes.trim() || null,
      status: formSegurado.status || "Lead",
    };

    const { error } = await supabase.from("segurados").insert([payload]);

    if (error) {
      console.error("Erro ao salvar segurado:", error);
      setMensagemFormulario("Erro ao salvar segurado. Confira as permissões RLS no Supabase.");
      setSalvandoSegurado(false);
      return;
    }

    setMensagemFormulario("Segurado cadastrado com sucesso!");

    setFormSegurado({
      nome: "",
      cpf_cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
      data_nascimento: "",
      tipo_pessoa: "Física",
      perfil_cliente: "",
      observacoes: "",
      status: "Lead",
    });

    await carregarSegurados();
    setSalvandoSegurado(false);
  }

  const activeItem = useMemo(
    () => menu.find((item) => item.id === active),
    [active]
  );

  const pages = {
    dashboard: <Dashboard seguradosLista={seguradosData} />,
    segurados: (
      <TabelaSegurados
        seguradosLista={seguradosData}
        loading={loadingSegurados}
        erro={erroSegurados}
        mostrarFormulario={mostrarFormularioSegurado}
        setMostrarFormulario={setMostrarFormularioSegurado}
        formSegurado={formSegurado}
        setFormSegurado={setFormSegurado}
        salvandoSegurado={salvandoSegurado}
        mensagemFormulario={mensagemFormulario}
        salvarSegurado={salvarSegurado}
      />
    ),
    propostas: <TabelaPropostas />,
    apolices: (
      <ModuloSimples
        title="Apólices"
        subtitle="Gestão de apólices emitidas, vigentes, canceladas, renovadas e a vencer."
      />
    ),
    renovacoes: (
      <ModuloSimples
        title="Renovações"
        subtitle="Alertas para apólices vencendo em 30 dias, 15 dias, vencidas e clientes sem renovação."
      />
    ),
    sinistros: (
      <ModuloSimples
        title="Sinistros"
        subtitle="Acompanhamento de ocorrências, documentação, status e apólice vinculada."
      />
    ),
    comissoes: (
      <ModuloSimples
        title="Comissões"
        subtitle="Controle de comissões previstas, recebidas, pendentes e canceladas."
      />
    ),
    seguradoras: (
      <ModuloSimples
        title="Seguradoras Parceiras"
        subtitle="Cadastro de seguradoras, contatos comerciais, ramos atendidos e comissão padrão."
      />
    ),
    crm: (
      <ModuloSimples
        title="CRM / Follow-up"
        subtitle="Controle de contatos, próximos retornos, canal de atendimento, interesse e status do lead."
      />
    ),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400 p-3 text-slate-950 shadow-lg shadow-cyan-500/20">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1 className="text-lg font-black text-white">Gestão Seguros 360</h1>
            <p className="text-xs text-slate-500">Corretoras • Seguradoras</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  selected
                    ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Sistema Web Integrado
              </p>

              <h2 className="text-xl font-black text-white md:text-2xl">
                {activeItem?.label || "Dashboard"}
              </h2>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200">
              <Plus size={18} />
              Ação rápida
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {menu.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                    selected
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/[0.06] text-slate-300"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </header>

        <section className="px-4 py-6 md:px-8 md:py-8">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {pages[active]}
          </motion.div>
        </section>
      </main>
    </div>
  );
}