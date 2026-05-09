import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Handshake,
  LayoutDashboard,
  Menu,
  PhoneCall,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Umbrella,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "segurados", label: "Segurados", icon: UsersRound },
  { id: "ramos", label: "Seguros / Ramos", icon: Umbrella },
  { id: "propostas", label: "Propostas", icon: ClipboardList },
  { id: "apolices", label: "Apólices", icon: FileCheck2 },
  { id: "renovacoes", label: "Renovações", icon: RefreshCcw },
  { id: "seguradoras", label: "Seguradoras", icon: Handshake },
  { id: "sinistros", label: "Sinistros", icon: AlertTriangle },
  { id: "comissoes", label: "Comissões", icon: BadgeDollarSign },
  { id: "crm", label: "Follow-up / CRM", icon: PhoneCall },
  { id: "documentos", label: "Documentos", icon: FileText },
];

const segurados = [
  { id: 1, nome: "Mariana Oliveira", documento: "123.456.789-00", telefone: "(11) 99999-1010", email: "mariana@email.com", perfil: "Pessoa Física", status: "Ativo", interesse: "Seguro Auto" },
  { id: 2, nome: "Construtora Norte Ltda", documento: "12.345.678/0001-90", telefone: "(11) 3333-2020", email: "financeiro@construtoranorte.com", perfil: "Pessoa Jurídica", status: "Renovação", interesse: "Riscos de Engenharia" },
  { id: 3, nome: "Lucas Pereira", documento: "987.654.321-00", telefone: "(11) 98888-3030", email: "lucas@email.com", perfil: "Pessoa Física", status: "Lead", interesse: "Seguro Vida" },
];

const propostas = [
  { id: 101, cliente: "Mariana Oliveira", tipo: "Seguro Auto", seguradora: "Tokio Marine", premio: 2480, parcelas: 10, validade: "2026-05-20", status: "Aceita" },
  { id: 102, cliente: "Lucas Pereira", tipo: "Seguro Vida", seguradora: "Porto Seguro", premio: 960, parcelas: 12, validade: "2026-05-18", status: "Enviada" },
  { id: 103, cliente: "Construtora Norte Ltda", tipo: "Riscos de Engenharia", seguradora: "Tokio Marine", premio: 76200, parcelas: 6, validade: "2026-05-30", status: "Em análise" },
  { id: 104, cliente: "Clínica Bem Viver", tipo: "Responsabilidade Civil", seguradora: "Mapfre", premio: 3900, parcelas: 8, validade: "2026-05-15", status: "Recusada" },
];

const apolices = [
  { id: 201, numero: "AP-2026-0001", cliente: "Mariana Oliveira", seguradora: "Tokio Marine", tipo: "Seguro Auto", inicio: "2026-01-10", fim: "2027-01-10", premioLiquido: 2100, premioTotal: 2480, status: "Vigente" },
  { id: 202, numero: "AP-2025-0088", cliente: "Construtora Norte Ltda", seguradora: "Tokio Marine", tipo: "Riscos de Engenharia", inicio: "2025-06-01", fim: "2026-05-25", premioLiquido: 76000, premioTotal: 82100, status: "A vencer" },
  { id: 203, numero: "AP-2025-0030", cliente: "Lucas Pereira", seguradora: "Porto Seguro", tipo: "Seguro Vida", inicio: "2025-02-01", fim: "2026-02-01", premioLiquido: 820, premioTotal: 960, status: "Renovada" },
];

const sinistros = [
  { id: 301, cliente: "Mariana Oliveira", apolice: "AP-2026-0001", tipo: "Colisão", data: "2026-04-27", status: "Em análise" },
  { id: 302, cliente: "Construtora Norte Ltda", apolice: "AP-2025-0088", tipo: "Danos à obra", data: "2026-05-02", status: "Aberto" },
];

const comissoes = [
  { id: 401, apolice: "AP-2026-0001", seguradora: "Tokio Marine", premioLiquido: 2100, percentual: 12, status: "Recebida", dataPrevista: "2026-02-10" },
  { id: 402, apolice: "AP-2025-0088", seguradora: "Tokio Marine", premioLiquido: 76000, percentual: 10, status: "A receber", dataPrevista: "2026-06-05" },
  { id: 403, apolice: "AP-2025-0030", seguradora: "Porto Seguro", premioLiquido: 820, percentual: 15, status: "Pendente", dataPrevista: "2026-05-28" },
];

const seguradoras = [
  { id: 501, nome: "Tokio Marine", cnpj: "33.164.021/0001-00", contato: "Canal Comercial SP", email: "comercial@tokio.com.br", ramos: "Auto, RE, Empresarial", comissao: "10% a 15%", status: "Ativa" },
  { id: 502, nome: "Porto Seguro", cnpj: "61.198.164/0001-60", contato: "Relacionamento Corretores", email: "corretores@porto.com.br", ramos: "Auto, Vida, Residencial", comissao: "12% a 18%", status: "Ativa" },
  { id: 503, nome: "Mapfre", cnpj: "61.074.175/0001-38", contato: "Área Comercial", email: "comercial@mapfre.com.br", ramos: "RC, Empresarial, Vida", comissao: "8% a 14%", status: "Em análise" },
];

const ramos = [
  { id: 701, nome: "Seguro Auto", ramo: "Automóvel", seguradora: "Tokio Marine", coberturas: "Colisão, roubo, furto, terceiros", valorEstimado: 2480, comissao: 12, status: "Ativo" },
  { id: 702, nome: "Riscos de Engenharia", ramo: "Engenharia", seguradora: "Tokio Marine", coberturas: "Danos à obra, incêndio, eventos naturais, terceiros", valorEstimado: 76200, comissao: 10, status: "Ativo" },
  { id: 703, nome: "Seguro Vida", ramo: "Pessoas", seguradora: "Porto Seguro", coberturas: "Morte, invalidez, assistência funeral", valorEstimado: 960, comissao: 15, status: "Ativo" },
];

const crm = [
  { id: 601, cliente: "Lucas Pereira", ultimoContato: "2026-05-06", proximoContato: "2026-05-09", canal: "WhatsApp", interesse: "Seguro Vida", status: "Lead quente" },
  { id: 602, cliente: "Construtora Norte Ltda", ultimoContato: "2026-05-04", proximoContato: "2026-05-10", canal: "E-mail", interesse: "Renovação RE", status: "Renovação" },
];

const revenueByMonth = [
  { mes: "Jan", receita: 12800, comissao: 3200 },
  { mes: "Fev", receita: 18200, comissao: 4100 },
  { mes: "Mar", receita: 16900, comissao: 3800 },
  { mes: "Abr", receita: 24100, comissao: 7200 },
  { mes: "Mai", receita: 35600, comissao: 10400 },
];

const ramoChartData = [
  { name: "Auto", value: 38 },
  { name: "Vida", value: 24 },
  { name: "Engenharia", value: 18 },
  { name: "RC", value: 12 },
  { name: "Residencial", value: 8 },
];

const propostaStatusData = [
  { status: "Em análise", total: 7 },
  { status: "Enviada", total: 12 },
  { status: "Aceita", total: 9 },
  { status: "Recusada", total: 3 },
];

function currency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function statusClass(status) {
  const styles = {
    Ativo: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Ativa: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Vigente: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Aceita: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Recebida: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Lead: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    "Lead quente": "bg-sky-500/15 text-sky-300 border-sky-400/30",
    Enviada: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    "Em análise": "bg-amber-500/15 text-amber-300 border-amber-400/30",
    Renovação: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    Renovada: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    "A vencer": "bg-orange-500/15 text-orange-300 border-orange-400/30",
    "A receber": "bg-orange-500/15 text-orange-300 border-orange-400/30",
    Pendente: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    Aberto: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    Recusada: "bg-red-500/15 text-red-300 border-red-400/30",
  };
  return styles[status] || "bg-white/10 text-slate-200 border-white/15";
}

function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(children)}`}>{children}</span>;
}

function MetricCard({ title, value, detail, icon: Icon, accent = "from-cyan-400 to-blue-500" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{detail}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}><Icon size={22} /></div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle, actionLabel = "Novo registro" }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          <ShieldCheck size={14} /> Gestão Seguros 360
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>
      </div>
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
        <Plus size={18} /> {actionLabel}
      </button>
    </div>
  );
}

function SearchBar({ placeholder = "Buscar por cliente, seguradora, apólice ou status..." }) {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-slate-300">
      <Search size={18} className="text-slate-500" />
      <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder={placeholder} />
    </div>
  );
}

function TableShell({ columns, rows, renderRow }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/[0.06] text-xs uppercase tracking-wider text-slate-400">
            <tr>{columns.map((column) => <th key={column} className="px-5 py-4 font-semibold">{column}</th>)}<th className="px-5 py-4 text-right font-semibold">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">{rows.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  const totalComissoes = comissoes.reduce((sum, item) => sum + (item.premioLiquido * item.percentual) / 100, 0);
  const recebidas = comissoes.filter((item) => item.status === "Recebida").reduce((sum, item) => sum + (item.premioLiquido * item.percentual) / 100, 0);
  const receita = apolices.reduce((sum, item) => sum + item.premioTotal, 0);

  return (
    <div>
      <SectionHeader title="Dashboard Gerencial" subtitle="Visão executiva de propostas, apólices, renovações, sinistros e comissões da corretora." actionLabel="Nova proposta" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Clientes / segurados" value={segurados.length} detail="Leads, ativos e renovações" icon={UsersRound} />
        <MetricCard title="Propostas" value={propostas.length} detail="Cotações em andamento" icon={ClipboardList} accent="from-indigo-400 to-violet-500" />
        <MetricCard title="Apólices vigentes" value={apolices.filter((a) => a.status === "Vigente").length} detail="Carteira ativa" icon={ShieldCheck} accent="from-emerald-400 to-teal-500" />
        <MetricCard title="Sinistros em aberto" value={sinistros.filter((s) => ["Aberto", "Em análise"].includes(s.status)).length} detail="Demandam acompanhamento" icon={AlertTriangle} accent="from-orange-400 to-rose-500" />
        <MetricCard title="Comissões previstas" value={currency(totalComissoes)} detail="Baseado no prêmio líquido" icon={BadgeDollarSign} accent="from-amber-300 to-orange-500" />
        <MetricCard title="Comissões recebidas" value={currency(recebidas)} detail="Confirmadas no financeiro" icon={WalletCards} accent="from-lime-300 to-emerald-500" />
        <MetricCard title="Receita estimada" value={currency(receita)} detail="Prêmio total em apólices" icon={CheckCircle2} accent="from-cyan-300 to-blue-500" />
        <MetricCard title="Apólices a vencer" value={apolices.filter((a) => a.status === "A vencer").length} detail="Prioridade de renovação" icon={CalendarClock} accent="from-fuchsia-400 to-purple-500" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl xl:col-span-2">
          <h3 className="font-bold text-white">Receita e comissões</h3>
          <p className="mb-4 text-sm text-slate-400">Evolução mensal estimada</p>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueByMonth}><defs><linearGradient id="receita" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient><linearGradient id="comissao" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} /><stop offset="95%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" /><XAxis dataKey="mes" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: "16px", color: "#fff" }} formatter={(value) => currency(value)} /><Area type="monotone" dataKey="receita" stroke="#22d3ee" fill="url(#receita)" strokeWidth={3} /><Area type="monotone" dataKey="comissao" stroke="#a78bfa" fill="url(#comissao)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl">
          <h3 className="font-bold text-white">Carteira por ramo</h3>
          <p className="text-sm text-slate-400">Distribuição dos seguros</p>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: "16px", color: "#fff" }} /><Pie data={ramoChartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={102} paddingAngle={4}>{ramoChartData.map((entry, index) => <Cell key={entry.name} fill={["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"][index % 5]} />)}</Pie></PieChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl">
        <h3 className="font-bold text-white">Status das propostas</h3>
        <p className="mb-4 text-sm text-slate-400">Funil comercial por etapa</p>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={propostaStatusData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" /><XAxis dataKey="status" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: "16px", color: "#fff" }} /><Bar dataKey="total" fill="#22d3ee" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </div>
    </div>
  );
}

function Segurados() {
  return <DataTable title="Clientes / Segurados" subtitle="Base de leads, segurados ativos, clientes em renovação e inativos." actionLabel="Novo segurado" columns={["Nome", "CPF/CNPJ", "Contato", "Perfil", "Interesse", "Status"]} rows={segurados} renderRow={(item) => <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.nome}</td><td className="px-5 py-4">{item.documento}</td><td className="px-5 py-4"><div>{item.telefone}</div><div className="text-xs text-slate-500">{item.email}</div></td><td className="px-5 py-4">{item.perfil}</td><td className="px-5 py-4">{item.interesse}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Detalhes</button></td></tr>} />;
}

function DataTable({ title, subtitle, actionLabel, columns, rows, renderRow }) {
  return <div><SectionHeader title={title} subtitle={subtitle} actionLabel={actionLabel} /><SearchBar /><TableShell columns={columns} rows={rows} renderRow={renderRow} /></div>;
}

function Ramos() {
  return <div><SectionHeader title="Seguros / Ramos" subtitle="Catálogo de seguros oferecidos, coberturas, valores e percentuais de comissão." actionLabel="Novo seguro" /><SearchBar placeholder="Buscar por ramo, seguro ou seguradora..." /><div className="grid gap-4 lg:grid-cols-3">{ramos.map((item) => <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl"><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-white">{item.nome}</h3><p className="text-sm text-slate-400">{item.ramo} • {item.seguradora}</p></div><Badge>{item.status}</Badge></div><p className="text-sm text-slate-300"><span className="text-slate-500">Coberturas:</span> {item.coberturas}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-xs text-slate-500">Valor estimado</p><p className="font-bold text-white">{currency(item.valorEstimado)}</p></div><div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-xs text-slate-500">Comissão</p><p className="font-bold text-white">{item.comissao}%</p></div></div></motion.div>)}</div></div>;
}

function Propostas() {
  return <DataTable title="Propostas / Cotações" subtitle="Controle comercial de cotações enviadas, aceitas, recusadas e em análise." actionLabel="Nova cotação" columns={["Cliente", "Tipo de seguro", "Seguradora", "Prêmio", "Parcelas", "Validade", "Status"]} rows={propostas} renderRow={(item) => <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.cliente}</td><td className="px-5 py-4">{item.tipo}</td><td className="px-5 py-4">{item.seguradora}</td><td className="px-5 py-4 font-semibold">{currency(item.premio)}</td><td className="px-5 py-4">{item.parcelas}x</td><td className="px-5 py-4">{new Date(item.validade).toLocaleDateString("pt-BR")}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Gerar resumo</button></td></tr>} />;
}

function Apolices() {
  return <DataTable title="Apólices" subtitle="Gestão de apólices emitidas, vigentes, canceladas, renovadas e a vencer." actionLabel="Nova apólice" columns={["Apólice", "Cliente", "Seguradora", "Tipo", "Vigência", "Prêmio total", "Status"]} rows={apolices} renderRow={(item) => <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.numero}</td><td className="px-5 py-4">{item.cliente}</td><td className="px-5 py-4">{item.seguradora}</td><td className="px-5 py-4">{item.tipo}</td><td className="px-5 py-4">{new Date(item.inicio).toLocaleDateString("pt-BR")} até {new Date(item.fim).toLocaleDateString("pt-BR")}</td><td className="px-5 py-4 font-semibold">{currency(item.premioTotal)}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Documento</button></td></tr>} />;
}

function Renovacoes() {
  const cards = [
    { title: "Vencendo em 30 dias", value: 6, icon: CalendarClock },
    { title: "Vencendo em 15 dias", value: 3, icon: Bell, accent: "from-amber-300 to-orange-500" },
    { title: "Apólices vencidas", value: 2, icon: AlertTriangle, accent: "from-rose-400 to-red-500" },
    { title: "Clientes sem renovação", value: 4, icon: UsersRound, accent: "from-purple-400 to-fuchsia-500" },
  ];
  return <div><SectionHeader title="Renovações" subtitle="Central de alertas para apólices próximas do vencimento e clientes sem renovação." actionLabel="Criar alerta" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <MetricCard key={card.title} title={card.title} value={card.value} detail="Acompanhar prioridade" icon={card.icon} accent={card.accent || "from-cyan-400 to-blue-500"} />)}</div></div>;
}

function Seguradoras() {
  return <DataTable title="Seguradoras Parceiras" subtitle="Cadastro de seguradoras, contatos comerciais, ramos atendidos e comissão padrão." actionLabel="Nova seguradora" columns={["Seguradora", "CNPJ", "Contato", "Ramos", "Comissão", "Status"]} rows={seguradoras} renderRow={(item) => <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.nome}</td><td className="px-5 py-4">{item.cnpj}</td><td className="px-5 py-4"><div>{item.contato}</div><div className="text-xs text-slate-500">{item.email}</div></td><td className="px-5 py-4">{item.ramos}</td><td className="px-5 py-4 font-semibold">{item.comissao}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Editar</button></td></tr>} />;
}

function Sinistros() {
  return <DataTable title="Sinistros" subtitle="Acompanhamento de ocorrências, documentação, status e vínculo com apólices." actionLabel="Novo sinistro" columns={["Cliente", "Apólice", "Tipo", "Data", "Status", "Documentos"]} rows={sinistros} renderRow={(item) => <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.cliente}</td><td className="px-5 py-4">{item.apolice}</td><td className="px-5 py-4">{item.tipo}</td><td className="px-5 py-4">{new Date(item.data).toLocaleDateString("pt-BR")}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4">Pendente upload</td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Acompanhar</button></td></tr>} />;
}

function Comissoes() {
  return <DataTable title="Comissões" subtitle="Previsão, recebimento e pendências de comissão por apólice e seguradora." actionLabel="Lançar comissão" columns={["Apólice", "Seguradora", "Prêmio líquido", "%", "Valor comissão", "Data prevista", "Status"]} rows={comissoes} renderRow={(item) => { const valor = (item.premioLiquido * item.percentual) / 100; return <tr key={item.id} className="transition hover:bg-white/[0.04]"><td className="px-5 py-4 font-semibold text-white">{item.apolice}</td><td className="px-5 py-4">{item.seguradora}</td><td className="px-5 py-4">{currency(item.premioLiquido)}</td><td className="px-5 py-4">{item.percentual}%</td><td className="px-5 py-4 font-semibold text-white">{currency(valor)}</td><td className="px-5 py-4">{new Date(item.dataPrevista).toLocaleDateString("pt-BR")}</td><td className="px-5 py-4"><Badge>{item.status}</Badge></td><td className="px-5 py-4 text-right"><button className="text-cyan-300 hover:text-cyan-200">Baixar</button></td></tr>; }} />;
}

function CRM() {
  return <div><SectionHeader title="Follow-up / CRM" subtitle="Controle de contatos, próximos retornos, canal de atendimento, interesse e status do lead." actionLabel="Novo follow-up" /><SearchBar /><div className="grid gap-4 lg:grid-cols-2">{crm.map((item) => <div key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-white">{item.cliente}</h3><p className="text-sm text-slate-400">Interesse: {item.interesse}</p></div><Badge>{item.status}</Badge></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-xs text-slate-500">Último contato</p><p className="font-semibold text-white">{new Date(item.ultimoContato).toLocaleDateString("pt-BR")}</p></div><div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-xs text-slate-500">Próximo contato</p><p className="font-semibold text-white">{new Date(item.proximoContato).toLocaleDateString("pt-BR")}</p></div><div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-xs text-slate-500">Canal</p><p className="font-semibold text-white">{item.canal}</p></div></div></div>)}</div></div>;
}

function Documentos() {
  const proposta = propostas[0];
  return <div><SectionHeader title="Resumo / Documento Comercial" subtitle="Modelo inicial para transformar o comprovante de venda em resumo de proposta ou apólice." actionLabel="Gerar PDF" /><div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl print:bg-white print:text-slate-950"><div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start"><div><div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200 print:text-slate-800"><ShieldCheck size={14} /> Gestão Seguros 360</div><h2 className="mt-3 text-2xl font-black text-white print:text-slate-950">Resumo da Proposta</h2><p className="text-sm text-slate-400 print:text-slate-600">Documento comercial para envio ao cliente.</p></div><div className="text-sm text-slate-400 print:text-slate-600"><p>Data: {new Date().toLocaleDateString("pt-BR")}</p><p>Validade: {new Date(proposta.validade).toLocaleDateString("pt-BR")}</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2"><InfoBox label="Cliente" value={proposta.cliente} /><InfoBox label="Tipo de seguro" value={proposta.tipo} /><InfoBox label="Seguradora" value={proposta.seguradora} /><InfoBox label="Valor do prêmio" value={currency(proposta.premio)} /><InfoBox label="Parcelamento" value={`${proposta.parcelas}x de ${currency(proposta.premio / proposta.parcelas)}`} /><InfoBox label="Status" value={proposta.status} /></div><div className="mt-5 rounded-3xl bg-white/[0.06] p-5 print:bg-slate-100"><h3 className="font-bold text-white print:text-slate-950">Observações</h3><p className="mt-2 text-sm leading-6 text-slate-300 print:text-slate-700">Valores sujeitos à aceitação da seguradora, análise de risco e conferência documental. Este documento é um resumo comercial e não substitui a apólice emitida.</p></div><button onClick={() => window.print()} className="mt-6 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300">Imprimir / Salvar PDF</button></div></div>;
}

function InfoBox({ label, value }) {
  return <div className="rounded-3xl bg-white/[0.06] p-5 print:bg-slate-100"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 font-bold text-white print:text-slate-950">{value}</p></div>;
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = useMemo(() => menuItems.find((item) => item.id === active), [active]);
  const content = { dashboard: <Dashboard />, segurados: <Segurados />, ramos: <Ramos />, propostas: <Propostas />, apolices: <Apolices />, renovacoes: <Renovacoes />, seguradoras: <Seguradoras />, sinistros: <Sinistros />, comissoes: <Comissoes />, crm: <CRM />, documentos: <Documentos /> }[active];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden"><div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" /><div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" /><div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" /></div>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl lg:block"><Brand /><nav className="space-y-2">{menuItems.map((item) => <MenuButton key={item.id} item={item} active={active} setActive={setActive} />)}</nav></aside>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur lg:hidden"><div className="h-full w-80 max-w-[88vw] border-r border-white/10 bg-slate-950 p-5"><div className="mb-5 flex items-center justify-between"><Brand compact /><button onClick={() => setMobileOpen(false)} className="rounded-xl bg-white/10 p-2"><X size={20} /></button></div><nav className="space-y-2">{menuItems.map((item) => <MenuButton key={item.id} item={item} active={active} setActive={(id) => { setActive(id); setMobileOpen(false); }} />)}</nav></div></div>}
      <main className="lg:pl-72"><header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 px-4 py-4 backdrop-blur-xl md:px-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><button className="rounded-2xl bg-white/[0.06] p-3 text-cyan-300 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Sistema Web Integrado</p><h2 className="text-xl font-black text-white md:text-2xl">{activeItem?.label || "Dashboard"}</h2></div></div><button className="hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200 md:inline-flex"><Plus size={18} /> Ação rápida</button></div></header><div className="px-4 py-6 md:px-8 md:py-8"><motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{content}</motion.div></div></main>
    </div>
  );
}

function Brand({ compact = false }) {
  return <div className={`${compact ? "" : "mb-8"} flex items-center gap-3`}><div className="rounded-2xl bg-cyan-400 p-3 text-slate-950 shadow-lg shadow-cyan-500/20"><ShieldCheck size={26} /></div><div><h1 className="text-lg font-black text-white">Gestão Seguros 360</h1><p className="text-xs text-slate-500">Corretoras • Seguradoras</p></div></div>;
}

function MenuButton({ item, active, setActive }) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return <button onClick={() => setActive(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${isActive ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}><Icon size={18} />{item.label}</button>;
}
