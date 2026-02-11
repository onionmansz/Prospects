import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── Design tokens (RBC GAM palette from screenshot) ───
const T = {
  navy: "#003168",
  blue: "#0051A5",
  blueLight: "#E8F0FA",
  gold: "#8B6914",
  goldLight: "#F5F0E6",
  text: "#1A1A1A",
  textMid: "#555555",
  textLight: "#888888",
  border: "#D9D9D9",
  borderLight: "#EBEBEB",
  bg: "#F7F7F7",
  white: "#FFFFFF",
  green: "#1B7F37",
  greenLight: "#E6F4EA",
  red: "#C4262E",
  redLight: "#FDECEC",
  orange: "#D4760A",
  orangeLight: "#FFF3E0",
};

const CHART_COLORS = ["#003168", "#0051A5", "#5B9BD5", "#8B6914", "#D4A843", "#7A7A7A", "#1B7F37", "#C4262E"];

// ─── Mock Data ───
const prospectsDemographics = [
  { name: "25–34", value: 2 },
  { name: "35–44", value: 3 },
  { name: "45–54", value: 4 },
  { name: "55–64", value: 4 },
  { name: "65+", value: 2 },
];

const accountTypeData = [
  { name: "RRSP", value: 11 },
  { name: "TFSA", value: 13 },
  { name: "Non-Reg", value: 5 },
  { name: "RRIF", value: 2 },
  { name: "RESP", value: 3 },
  { name: "FHSA", value: 1 },
];

const auaBreakdownData = [
  { name: "<$50K", value: 3 },
  { name: "$50–150K", value: 3 },
  { name: "$150–300K", value: 4 },
  { name: "$300–500K", value: 3 },
  { name: "$500K+", value: 2 },
];

const totalPipeline = 15;
const toolUsageData = [
  { tool: "PRS", completed: 8, pending: 3 },
  { tool: "GPX", completed: 7 },
  { tool: "IPS", completed: 5 },
  { tool: "PI", completed: 4 },
  { tool: "MER", completed: 6 },
  { tool: "Buckets", completed: 3 },
];

const ALL_TOOLS = ["PRS", "GPX", "IPS", "PI", "MER", "Buckets"];

const clientRecords = [
  { id: 1, name: "Margaret Chen", age: 62, job: "Retired Pharmacist", segment: "Mass Affluent", aua: 385000, products: ["RRSP", "TFSA", "Non-Reg"], gaps: ["No RRIF conversion plan", "No estate plan referral"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "MER", "IPS"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Conservative Portfolio", code: "RBF571", balance: 195000 }, { name: "RBC Bond Fund", code: "RBF140", balance: 68000 }] },
      { account: "TFSA", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 72000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC Canadian Short-Term Income Fund", code: "RBF220", balance: 50000 }] },
    ],
  },
  { id: 2, name: "David Thompson", age: 44, job: "Marketing Manager", segment: "Mass Affluent", aua: 142000, products: ["RRSP", "TFSA"], gaps: ["No RESP (2 children)", "No insurance referral"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 98000 }] },
      { account: "TFSA", funds: [{ name: "RBC Select Growth Portfolio", code: "RBF573", balance: 44000 }] },
    ],
  },
  { id: 3, name: "Priya Sharma", age: 57, job: "VP Operations, Manufacturing", segment: "High Net Worth", aua: 620000, products: ["RRSP", "TFSA", "Non-Reg", "RESP"], gaps: ["Non-reg tax optimization needed", "Approaching DS referral threshold"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "IPS", "PI", "MER", "Buckets"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 280000 }, { name: "RBC Global Equity Focus Fund", code: "RBF617", balance: 105000 }] },
      { account: "TFSA", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 88000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC U.S. Equity Fund", code: "RBF275", balance: 112000 }] },
      { account: "RESP", funds: [{ name: "RBC Target 2030 Education Fund", code: "RBF636", balance: 35000 }] },
    ],
  },
  { id: 4, name: "Jean-Pierre Dubois", age: 38, job: "Freelance Graphic Designer", segment: "Mass Market", aua: 48000, products: ["TFSA"], gaps: ["No RRSP", "No FHSA (renter)", "No financial plan"], prs: "Pending", fpAnchored: false, toolsDone: [],
    holdings: [
      { account: "TFSA", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 48000 }] },
    ],
  },
  { id: 5, name: "Sandra Williams", age: 71, job: "Retired Teacher", segment: "Mass Affluent", aua: 290000, products: ["RRIF", "TFSA"], gaps: ["RRIF withdrawal strategy review", "OAS clawback risk"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "IPS", "MER", "Buckets"],
    holdings: [
      { account: "RRIF", funds: [{ name: "RBC Select Conservative Portfolio", code: "RBF571", balance: 210000 }, { name: "RBC Bond Fund", code: "RBF140", balance: 42000 }] },
      { account: "TFSA", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 38000 }] },
    ],
  },
  { id: 6, name: "Michael Okafor", age: 29, job: "Junior Software Developer", segment: "Mass Market", aua: 22000, products: ["TFSA", "FHSA"], gaps: ["No RRSP", "No insurance referral", "No financial plan"], prs: "Pending", fpAnchored: false, toolsDone: [],
    holdings: [
      { account: "TFSA", funds: [{ name: "RBC Select Growth Portfolio", code: "RBF573", balance: 15000 }] },
      { account: "FHSA", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 7000 }] },
    ],
  },
  { id: 7, name: "Linda Martinez", age: 53, job: "Dental Practice Owner", segment: "High Net Worth", aua: 510000, products: ["RRSP", "TFSA", "Non-Reg", "RESP"], gaps: ["Investment Advantage eligible ($250K+)", "Consolidation opportunity"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "IPS", "PI", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 215000 }, { name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 85000 }] },
      { account: "TFSA", funds: [{ name: "RBC Global Equity Focus Fund", code: "RBF617", balance: 88000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC U.S. Equity Fund", code: "RBF275", balance: 78000 }] },
      { account: "RESP", funds: [{ name: "RBC Target 2032 Education Fund", code: "RBF638", balance: 44000 }] },
    ],
  },
  { id: 8, name: "Robert Kim", age: 67, job: "Semi-Retired Engineer", segment: "Mass Affluent", aua: 345000, products: ["RRSP", "TFSA"], gaps: ["RRIF conversion due (age 71 in 4 yrs)", "No estate plan referral"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Conservative Portfolio", code: "RBF571", balance: 260000 }, { name: "RBC Canadian Short-Term Income Fund", code: "RBF220", balance: 45000 }] },
      { account: "TFSA", funds: [{ name: "RBC Balanced Fund", code: "RBF290", balance: 40000 }] },
    ],
  },
  { id: 9, name: "Fatima Al-Hassan", age: 41, job: "Registered Nurse", segment: "Mass Market", aua: 67000, products: ["RRSP", "TFSA"], gaps: ["No RESP (1 child)", "Low contribution rate"], prs: "Pending", fpAnchored: false, toolsDone: ["GPX"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 42000 }] },
      { account: "TFSA", funds: [{ name: "RBC Select Growth Portfolio", code: "RBF573", balance: 25000 }] },
    ],
  },
  { id: 10, name: "James O'Brien", age: 59, job: "Sales Director, Automotive", segment: "Mass Affluent", aua: 275000, products: ["RRSP", "Non-Reg"], gaps: ["No TFSA (maxing room available)", "Pre-retirement plan needed"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "PI", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 185000 }, { name: "RBC Bond Fund", code: "RBF140", balance: 48000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 42000 }] },
    ],
  },
  { id: 11, name: "Catherine Tremblay", age: 48, job: "Corporate Lawyer", segment: "High Net Worth", aua: 780000, products: ["RRSP", "TFSA", "Non-Reg", "RESP"], gaps: ["DS referral candidate", "Corporate planning opportunity"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "GPX", "IPS", "PI", "MER", "Buckets"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Growth Portfolio", code: "RBF573", balance: 320000 }, { name: "RBC Global Equity Focus Fund", code: "RBF617", balance: 125000 }] },
      { account: "TFSA", funds: [{ name: "RBC U.S. Equity Fund", code: "RBF275", balance: 88000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 162000 }] },
      { account: "RESP", funds: [{ name: "RBC Target 2034 Education Fund", code: "RBF640", balance: 85000 }] },
    ],
  },
  { id: 12, name: "Ahmed Patel", age: 33, job: "Restaurant Manager", segment: "Mass Market", aua: 35000, products: ["TFSA"], gaps: ["No RRSP", "No FHSA", "No financial plan"], prs: "Pending", fpAnchored: false, toolsDone: [],
    holdings: [
      { account: "TFSA", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 35000 }] },
    ],
  },
  { id: 13, name: "Rachel Nguyen", age: 46, job: "HR Manager, Financial Services", segment: "Mass Affluent", aua: 195000, products: ["RRSP", "TFSA", "Non-Reg"], gaps: ["No RESP (1 child)", "Insurance referral needed"], prs: "Complete", fpAnchored: true, toolsDone: ["PRS", "IPS", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 110000 }] },
      { account: "TFSA", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 52000 }] },
      { account: "Non-Reg", funds: [{ name: "RBC Balanced Fund", code: "RBF290", balance: 33000 }] },
    ],
  },
  { id: 14, name: "Brian Fowler", age: 55, job: "Construction Superintendent", segment: "Mass Affluent", aua: 310000, products: ["RRSP", "TFSA"], gaps: ["Pre-retirement plan needed", "No Non-Reg tax strategy"], prs: "Pending", fpAnchored: false, toolsDone: ["GPX", "MER"],
    holdings: [
      { account: "RRSP", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 230000 }] },
      { account: "TFSA", funds: [{ name: "RBC Canadian Dividend Fund", code: "RBF266", balance: 80000 }] },
    ],
  },
  { id: 15, name: "Amira Hassan", age: 31, job: "UX Designer", segment: "Mass Market", aua: 28000, products: ["TFSA", "FHSA"], gaps: ["No RRSP", "No financial plan"], prs: "Pending", fpAnchored: false, toolsDone: ["Buckets"],
    holdings: [
      { account: "TFSA", funds: [{ name: "RBC Select Growth Portfolio", code: "RBF573", balance: 18000 }] },
      { account: "FHSA", funds: [{ name: "RBC Select Balanced Portfolio", code: "RBF572", balance: 10000 }] },
    ],
  },
];

// Anchored Client Equivalent generator — builds a mock "ideal" persona based on age + job
const getAnchoredEquivalent = (client) => {
  const age = client.age;
  const job = client.job;

  // Income estimate by job keywords
  let estIncome = 75000;
  if (/VP|Director|Owner|Lawyer|Corporate/i.test(job)) estIncome = 165000;
  else if (/Manager|Superintendent|Engineer/i.test(job)) estIncome = 105000;
  else if (/Nurse|Teacher|Pharmacist/i.test(job)) estIncome = 85000;
  else if (/Designer|Developer|Software/i.test(job)) estIncome = 80000;
  else if (/Freelance|Restaurant|Junior/i.test(job)) estIncome = 55000;
  if (/Retired|Semi-Retired/i.test(job)) estIncome = Math.round(estIncome * 0.6);

  // Target AUA by age bracket and income
  const ageFactor = age < 35 ? 0.8 : age < 45 ? 2.5 : age < 55 ? 4.5 : age < 65 ? 6.0 : 5.5;
  const targetAUA = Math.round(estIncome * ageFactor / 10000) * 10000;

  // Ideal accounts
  const idealAccounts = ["RRSP", "TFSA"];
  if (age >= 71) { idealAccounts[0] = "RRIF"; }
  if (age < 40 && !/own/i.test(job)) idealAccounts.push("FHSA");
  if (age >= 30 && age <= 55) idealAccounts.push("Non-Reg");
  if (age >= 30 && age <= 55 && estIncome > 70000) idealAccounts.push("RESP");

  // Ideal allocation
  let eqPct, fiPct, altPct;
  if (age < 35) { eqPct = 80; fiPct = 15; altPct = 5; }
  else if (age < 45) { eqPct = 70; fiPct = 25; altPct = 5; }
  else if (age < 55) { eqPct = 60; fiPct = 30; altPct = 10; }
  else if (age < 65) { eqPct = 45; fiPct = 45; altPct = 10; }
  else { eqPct = 30; fiPct = 55; altPct = 15; }

  // Ideal tools for this profile
  const idealTools = ["PRS", "GPX", "MER"];
  if (targetAUA > 150000) idealTools.push("IPS", "PI");
  if (age >= 50 || targetAUA > 250000) idealTools.push("Buckets");

  // Gap between actual and target
  const auaGap = targetAUA - client.aua;
  const auaGapPct = ((auaGap / targetAUA) * 100).toFixed(0);
  const missingAccounts = idealAccounts.filter(a => !client.products.includes(a));

  return {
    estIncome,
    targetAUA,
    idealAccounts,
    eqPct,
    fiPct,
    altPct,
    idealTools,
    auaGap,
    auaGapPct,
    missingAccounts,
  };
};

// Gap insights — flags obvious contradictions in the client's account mix
const getGapInsights = (client) => {
  const has = (acct) => client.products.includes(acct);
  const insights = [];

  if (has("RESP") && !has("RRSP")) {
    insights.push({ icon: "⚠️", text: "Has RESP but no RRSP — saving for the kids, but not for themselves.", severity: "high" });
  }
  if (has("Non-Reg") && !has("TFSA")) {
    insights.push({ icon: "⚠️", text: "Investing in non-registered but hasn't maxed TFSA — paying unnecessary tax on growth.", severity: "high" });
  }
  if (has("RRIF") && !has("TFSA")) {
    insights.push({ icon: "⚠️", text: "Drawing RRIF income with no TFSA — missing tax-free shelter for withdrawals not needed.", severity: "high" });
  }
  if (has("TFSA") && !has("RRSP") && !has("RRIF") && client.age >= 35) {
    insights.push({ icon: "⚠️", text: "Age 35+ with no RRSP — likely missing tax deductions. Could be leaving thousands on the table every April.", severity: "high" });
  }
  if (has("RRSP") && !has("TFSA")) {
    insights.push({ icon: "🔔", text: "Has RRSP but no TFSA — unused contribution room means lost tax-free growth.", severity: "medium" });
  }
  if (!has("FHSA") && client.age < 40 && !has("Non-Reg")) {
    insights.push({ icon: "💡", text: "Under 40, likely renter — FHSA could shelter up to $40K tax-free for a first home.", severity: "low" });
  }
  if (has("RRSP") && client.age >= 65) {
    insights.push({ icon: "🔔", text: "Age 65+ still holding RRSP — RRIF conversion deadline approaching. Plan withdrawals to minimize OAS clawback.", severity: "medium" });
  }
  if (client.products.length === 1) {
    insights.push({ icon: "⚠️", text: `Only one account type (${client.products[0]}) — no diversification across tax shelters. One conversation could double their footprint.`, severity: "high" });
  }
  const nonRegBal = client.holdings.filter(h => h.account === "Non-Reg").reduce((s, h) => s + h.funds.reduce((a, f) => a + f.balance, 0), 0);
  const regBal = client.holdings.filter(h => h.account !== "Non-Reg").reduce((s, h) => s + h.funds.reduce((a, f) => a + f.balance, 0), 0);
  if (nonRegBal > 0 && nonRegBal > regBal * 0.5 && client.aua > 100000) {
    insights.push({ icon: "🔔", text: `${fmt(nonRegBal)} sitting in non-registered — asset location review could reduce annual tax drag.`, severity: "medium" });
  }
  if (client.age >= 30 && client.age <= 55 && !has("RESP") && client.segment !== "Mass Market") {
    insights.push({ icon: "💡", text: "No RESP — if they have children, they're leaving the 20% CESG grant on the table.", severity: "low" });
  }

  return insights;
};

const productMixData = [
  { name: "Mutual Funds", value: 2850000, count: 22 },
  { name: "GICs", value: 680000, count: 8 },
  { name: "Savings", value: 220000, count: 5 },
];

const segmentTransactions = [
  { name: "Mass Affluent", value: 1980000, count: 18 },
  { name: "High Net Worth", value: 1350000, count: 7 },
  { name: "Mass Market", value: 420000, count: 10 },
];

const fpAnchoredData = [
  { name: "FP Anchored", value: 2800000, count: 24 },
  { name: "Not FP Anchored", value: 950000, count: 11 },
];

const transactionSizeData = [
  { name: "<$100K", count: 18, value: 840000 },
  { name: "$100–250K", count: 9, value: 1350000 },
  { name: "$250–500K", count: 5, value: 1180000 },
  { name: "$500K+", count: 3, value: 1880000 },
];

const mfSalesList = [
  { fund: "RBC Select Balanced Portfolio", code: "RBF572", series: "A", ytdSales: 620000, clients: 8, avgSize: 77500, trailing: 1.0 },
  { fund: "RBC Select Conservative Portfolio", code: "RBF571", series: "A", ytdSales: 480000, clients: 6, avgSize: 80000, trailing: 1.0 },
  { fund: "RBC Canadian Dividend Fund", code: "RBF266", series: "A", ytdSales: 340000, clients: 5, avgSize: 68000, trailing: 1.0 },
  { fund: "RBC Select Growth Portfolio", code: "RBF573", series: "A", ytdSales: 310000, clients: 4, avgSize: 77500, trailing: 1.0 },
  { fund: "RBC Bond Fund", code: "RBF140", series: "A", ytdSales: 280000, clients: 5, avgSize: 56000, trailing: 0.5 },
  { fund: "RBC Global Equity Focus Fund", code: "RBF617", series: "A", ytdSales: 245000, clients: 3, avgSize: 81667, trailing: 1.0 },
  { fund: "RBC Canadian Short-Term Income Fund", code: "RBF220", series: "A", ytdSales: 190000, clients: 4, avgSize: 47500, trailing: 0.5 },
  { fund: "RBC Balanced Fund", code: "RBF290", series: "A", ytdSales: 155000, clients: 3, avgSize: 51667, trailing: 1.0 },
  { fund: "RBC Select Very Conservative Portfolio", code: "RBF570", series: "A", ytdSales: 130000, clients: 3, avgSize: 43333, trailing: 0.75 },
  { fund: "RBC U.S. Equity Fund", code: "RBF275", series: "A", ytdSales: 100000, clients: 2, avgSize: 50000, trailing: 1.0 },
];

// ─── Utility ───
const fmt = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};
const fmtFull = (n) => `$${n.toLocaleString()}`;
const pct = (part, total) => ((part / total) * 100).toFixed(1) + "%";

// ─── Reusable Components ───
const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: T.white,
    border: `1px solid ${T.borderLight}`,
    borderTop: `3px solid ${accent || T.blue}`,
    padding: "16px 20px",
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ fontSize: 11, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontFamily: "'Source Sans 3', sans-serif" }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: T.text, fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: T.textMid, marginTop: 4, fontFamily: "'Source Sans 3', sans-serif" }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 700, color: T.gold, marginBottom: 12, marginTop: 24, fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.3px" }}>
    {children}
  </div>
);

const GapBadge = ({ text }) => (
  <span style={{
    display: "inline-block",
    background: T.orangeLight,
    color: T.orange,
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 3,
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{text}</span>
);

const ProductBadge = ({ text }) => (
  <span style={{
    display: "inline-block",
    background: T.blueLight,
    color: T.navy,
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 3,
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 600,
  }}>{text}</span>
);

const ToolOpBadge = ({ text }) => (
  <span style={{
    display: "inline-block",
    background: T.greenLight,
    color: T.green,
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 3,
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{text}</span>
);

const StatusDot = ({ status }) => {
  const c = status === "Complete" ? T.green : T.orange;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: c, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} />
      {status}
    </span>
  );
};

const MiniDonut = ({ data, size = 140 }) => (
  <ResponsiveContainer width={size} height={size}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.28} outerRadius={size * 0.45} paddingAngle={2} dataKey="value" stroke="none">
        {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

const DonutLegend = ({ data }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {data.map((d, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
        <span style={{ color: T.textMid, flex: 1 }}>{d.name}</span>
        <span style={{ fontWeight: 700, color: T.text }}>{d.value}</span>
      </div>
    ))}
  </div>
);

// ─── Page: Prospects ───
const ProspectsPage = () => {
  const [segFilter, setSegFilter] = useState("All");
  const [sortCol, setSortCol] = useState("aua");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);

  const totalClients = clientRecords.length;
  const totalAUA = clientRecords.reduce((s, c) => s + c.aua, 0);
  const totalGaps = clientRecords.reduce((s, c) => s + c.gaps.length, 0);
  const prsData = toolUsageData.find(t => t.tool === "PRS");
  const prsCovered = prsData.completed + (prsData.pending || 0);

  const filtered = useMemo(() => {
    let list = segFilter === "All" ? clientRecords : clientRecords.filter(c => c.segment === segFilter);
    return [...list].sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sortCol === "name") return m * a.name.localeCompare(b.name);
      if (sortCol === "aua") return m * (a.aua - b.aua);
      if (sortCol === "gaps") return m * (a.gaps.length - b.gaps.length);
      if (sortCol === "toolsOp") return m * ((ALL_TOOLS.length - a.toolsDone.length) - (ALL_TOOLS.length - b.toolsDone.length));
      return 0;
    });
  }, [segFilter, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortArrow = ({ col }) => sortCol === col ? <span style={{ marginLeft: 3, fontSize: 10 }}>{sortDir === "asc" ? "▲" : "▼"}</span> : null;

  const thStyle = {
    textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.textMid,
    textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `2px solid ${T.border}`,
    cursor: "pointer", userSelect: "none", fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "10px 12px", fontSize: 13, color: T.text, borderBottom: `1px solid ${T.borderLight}`,
    fontFamily: "'Source Sans 3', sans-serif", verticalAlign: "top",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <StatCard label="Total Clients" value={totalClients} sub="In pipeline" accent={T.navy} />
        <StatCard label="Total AUA" value={fmt(totalAUA)} sub={`Avg ${fmt(totalAUA / totalClients)} / client`} accent={T.blue} />
        <StatCard label="Identified Gaps" value={totalGaps} sub={`${(totalGaps / totalClients).toFixed(1)} avg per client`} accent={T.orange} />
        <StatCard label="PRS Coverage" value={`${prsCovered}/${totalPipeline}`} sub={`${prsData.completed} complete · ${prsData.pending} pending`} accent={T.green} />
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        {/* Demographics */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>Client Demographics</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={prospectsDemographics} />
            <DonutLegend data={prospectsDemographics} />
          </div>
        </div>
        {/* Account Types */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>Account Types</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={accountTypeData} />
            <DonutLegend data={accountTypeData} />
          </div>
        </div>
        {/* AUA Distribution */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>AUA Distribution</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={auaBreakdownData} />
            <DonutLegend data={auaBreakdownData} />
          </div>
        </div>
      </div>

      {/* Tool Usage - full width */}
      <div style={{ marginTop: 16, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
        <SectionTitle>Tool Usage</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 32px" }}>
          {toolUsageData.map((t, i) => {
            const covered = (t.completed || 0) + (t.pending || 0);
            const covPct = ((covered / totalPipeline) * 100).toFixed(0);
            const compPct = ((t.completed / totalPipeline) * 100).toFixed(0);
            return (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'Source Sans 3', sans-serif" }}>{t.tool}</span>
                  <span style={{ fontSize: 11, color: T.textLight, fontFamily: "'Source Sans 3', sans-serif" }}>
                    {t.pending !== undefined
                      ? <>{covered}/{totalPipeline} <span style={{ color: T.textMid, fontWeight: 600 }}>({covPct}%)</span></>
                      : <>{t.completed}/{totalPipeline} <span style={{ color: T.textMid, fontWeight: 600 }}>({compPct}%)</span></>
                    }
                  </span>
                </div>
                <div style={{ height: 14, background: T.bg, borderRadius: 3, overflow: "hidden", display: "flex" }}>
                  <div style={{
                    width: `${(t.completed / totalPipeline) * 100}%`,
                    background: T.navy,
                    borderRadius: t.pending ? "3px 0 0 3px" : 3,
                    transition: "width 0.4s ease",
                  }} />
                  {t.pending !== undefined && (
                    <div style={{
                      width: `${(t.pending / totalPipeline) * 100}%`,
                      background: T.border,
                      borderRadius: "0 3px 3px 0",
                      transition: "width 0.4s ease",
                    }} />
                  )}
                </div>
                {t.pending !== undefined && (
                  <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: T.textLight, fontFamily: "'Source Sans 3', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: T.navy, display: "inline-block" }} />
                      Completed ({t.completed})
                    </span>
                    <span style={{ fontSize: 10, color: T.textLight, fontFamily: "'Source Sans 3', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: T.border, display: "inline-block" }} />
                      Pending ({t.pending})
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Table */}
      <div style={{ marginTop: 24, background: T.white, border: `1px solid ${T.borderLight}` }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionTitle style={{ margin: 0 }}>Client Records</SectionTitle>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "High Net Worth", "Mass Affluent"].map(s => (
              <button key={s} onClick={() => setSegFilter(s)} style={{
                padding: "5px 14px", fontSize: 12, border: `1px solid ${segFilter === s ? T.blue : T.border}`,
                background: segFilter === s ? T.blueLight : T.white, color: segFilter === s ? T.blue : T.textMid,
                borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => handleSort("name")}>Client <SortArrow col="name" /></th>
                <th style={thStyle}>Age</th>
                <th style={thStyle}>Segment</th>
                <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => handleSort("aua")}>AUA <SortArrow col="aua" /></th>
                <th style={thStyle}>Products Held</th>
                <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => handleSort("gaps")}>Gaps Identified <SortArrow col="gaps" /></th>
                <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => handleSort("toolsOp")}>Tools Opportunity <SortArrow col="toolsOp" /></th>
                <th style={thStyle}>PRS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const isExpanded = expandedId === c.id;
                const ace = isExpanded ? getAnchoredEquivalent(c) : null;
                const colCount = 8;
                return (
                  <React.Fragment key={c.id}>
                    <tr
                      style={{ transition: "background 0.15s", cursor: "pointer", background: isExpanded ? T.blueLight : T.white }}
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = T.bg; }}
                      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = T.white; }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600, color: T.navy }}>
                        <span style={{ marginRight: 6, fontSize: 10, color: T.textLight, display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▶</span>
                        {c.name}
                      </td>
                      <td style={tdStyle}>{c.age}</td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3,
                          background: c.segment === "High Net Worth" ? T.goldLight : c.segment === "Mass Affluent" ? T.blueLight : T.bg,
                          color: c.segment === "High Net Worth" ? T.gold : c.segment === "Mass Affluent" ? T.navy : T.textMid,
                        }}>{c.segment}</span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{fmtFull(c.aua)}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {c.products.map(p => <ProductBadge key={p} text={p} />)}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {c.gaps.map((g, i) => <GapBadge key={i} text={g} />)}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {ALL_TOOLS.filter(t => !c.toolsDone.includes(t)).length === 0
                            ? <span style={{ fontSize: 11, color: T.green, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>✓ All complete</span>
                            : ALL_TOOLS.filter(t => !c.toolsDone.includes(t)).map(t => <ToolOpBadge key={t} text={t} />)
                          }
                        </div>
                      </td>
                      <td style={tdStyle}><StatusDot status={c.prs} /></td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={colCount} style={{ padding: 0, borderBottom: `2px solid ${T.blue}` }}>
                          <div style={{ display: "flex", gap: 0, background: T.bg }}>
                            {/* Left: Product Holdings */}
                            <div style={{ flex: 1, padding: "20px 24px", borderRight: `1px solid ${T.borderLight}` }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 14, fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                                Product Holdings
                              </div>
                              <div style={{ fontSize: 11, color: T.textLight, marginBottom: 12, fontFamily: "'Source Sans 3', sans-serif" }}>{c.job} · Age {c.age}</div>

                              {/* High-level account summary */}
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
                                {["RRSP", "TFSA", "Non-Reg", "RRIF", "RESP", "FHSA"].map(acct => {
                                  const held = c.holdings.find(h => h.account === acct);
                                  const bal = held ? held.funds.reduce((s, f) => s + f.balance, 0) : 0;
                                  return (
                                    <div key={acct} style={{
                                      padding: "8px 10px", borderRadius: 4,
                                      background: held ? T.white : T.bg,
                                      border: `1px solid ${held ? T.borderLight : T.border}`,
                                      opacity: held ? 1 : 0.6,
                                    }}>
                                      <div style={{ fontSize: 10, fontWeight: 700, color: held ? T.gold : T.textLight, fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.3px" }}>{acct}</div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: held ? T.navy : T.textLight, fontFamily: "'Source Sans 3', sans-serif", marginTop: 2 }}>
                                        {held ? fmtFull(bal) : "Doesn't have"}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Detailed fund breakdown */}
                              {(() => {
                                const insights = getGapInsights(c);
                                if (insights.length === 0) return null;
                                const severityBg = { high: T.redLight, medium: T.orangeLight, low: T.blueLight };
                                const severityColor = { high: T.red, medium: T.orange, low: T.blue };
                                const severityBorder = { high: "#E8A0A4", medium: "#E8C49A", low: "#B8D4F0" };
                                return (
                                  <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: T.red, marginBottom: 8, fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                                      Gap Insights
                                    </div>
                                    {insights.map((ins, i) => (
                                      <div key={i} style={{
                                        display: "flex", alignItems: "flex-start", gap: 8,
                                        padding: "8px 12px", marginBottom: 4, borderRadius: 4,
                                        background: severityBg[ins.severity],
                                        borderLeft: `3px solid ${severityBorder[ins.severity]}`,
                                      }}>
                                        <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1.4 }}>{ins.icon}</span>
                                        <span style={{ fontSize: 12, color: severityColor[ins.severity], fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.4 }}>{ins.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                              {c.holdings.map((h, hi) => (
                                <div key={hi} style={{ marginBottom: 14 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 6, fontFamily: "'Source Sans 3', sans-serif" }}>{h.account}</div>
                                  {h.funds.map((f, fi) => (
                                    <div key={fi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: T.white, borderRadius: 3, marginBottom: 4, border: `1px solid ${T.borderLight}` }}>
                                      <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "'Source Sans 3', sans-serif" }}>{f.name}</div>
                                        <div style={{ fontSize: 10, color: T.textLight, fontFamily: "'Source Code Pro', monospace" }}>{f.code}</div>
                                      </div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>{fmtFull(f.balance)}</div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: T.white, borderRadius: 3, border: `1px solid ${T.border}`, marginTop: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'Source Sans 3', sans-serif" }}>Total AUA</span>
                                <span style={{ fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>{fmtFull(c.aua)}</span>
                              </div>
                            </div>

                            {/* Right: Anchored Client Equivalent */}
                            <div style={{ flex: 1, padding: "20px 24px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 14, fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                                Anchored Client Equivalent
                              </div>
                              <div style={{ fontSize: 11, color: T.textLight, marginBottom: 14, fontFamily: "'Source Sans 3', sans-serif" }}>
                                Based on age {c.age} · {c.job}
                              </div>

                              {/* Ideal accounts + missing */}
                              <div style={{ background: T.white, borderRadius: 4, border: `1px solid ${T.borderLight}`, padding: "14px 16px", marginBottom: 12 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 8, fontFamily: "'Source Sans 3', sans-serif" }}>Ideal Accounts</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                                  {ace.idealAccounts.map(a => (
                                    <span key={a} style={{
                                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif",
                                      background: c.products.includes(a) ? T.greenLight : T.redLight,
                                      color: c.products.includes(a) ? T.green : T.red,
                                    }}>
                                      {c.products.includes(a) ? "✓" : "✗"} {a}
                                    </span>
                                  ))}
                                </div>
                                {ace.missingAccounts.length > 0 && (
                                  <div style={{ fontSize: 11, color: T.orange, fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
                                    Missing: {ace.missingAccounts.join(", ")}
                                  </div>
                                )}
                              </div>

                              {/* Ideal tools */}
                              <div style={{ background: T.white, borderRadius: 4, border: `1px solid ${T.borderLight}`, padding: "14px 16px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 8, fontFamily: "'Source Sans 3', sans-serif" }}>Recommended Tools</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                  {ace.idealTools.map(t => (
                                    <span key={t} style={{
                                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif",
                                      background: c.toolsDone.includes(t) ? T.greenLight : T.orangeLight,
                                      color: c.toolsDone.includes(t) ? T.green : T.orange,
                                    }}>
                                      {c.toolsDone.includes(t) ? "✓" : "○"} {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Page: Trades ───
const TradesPage = () => {
  const totalSales = productMixData.reduce((s, d) => s + d.value, 0);
  const totalTxns = productMixData.reduce((s, d) => s + d.count, 0);
  const avgPerClient = totalSales / clientRecords.length;
  const mfPct = ((productMixData[0].value / totalSales) * 100).toFixed(0);

  const thStyle = {
    textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: T.textMid,
    textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `2px solid ${T.border}`,
    fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "10px 14px", fontSize: 13, color: T.text, borderBottom: `1px solid ${T.borderLight}`,
    fontFamily: "'Source Sans 3', sans-serif",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <StatCard label="YTD Total Sales" value={fmt(totalSales)} sub={`${totalTxns} transactions`} accent={T.navy} />
        <StatCard label="Mutual Fund Sales" value={fmt(productMixData[0].value)} sub={`${mfPct}% of total`} accent={T.blue} />
        <StatCard label="Avg Sales / Client" value={fmt(avgPerClient)} sub={`${clientRecords.length} active clients`} accent={T.gold} />
        <StatCard label="FP Anchored" value={fmt(fpAnchoredData[0].value)} sub={pct(fpAnchoredData[0].value, totalSales)} accent={T.green} />
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        {/* Product Mix */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>Product Mix</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={productMixData} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {productMixData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i], flexShrink: 0 }} />
                  <span style={{ color: T.textMid, minWidth: 80 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{fmt(d.value)}</span>
                  <span style={{ color: T.textLight, fontSize: 11 }}>({d.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Segment */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>By Client Segment</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={segmentTransactions} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {segmentTransactions.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i], flexShrink: 0 }} />
                  <span style={{ color: T.textMid, minWidth: 100 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{fmt(d.value)}</span>
                  <span style={{ color: T.textLight, fontSize: 11 }}>({d.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* FP Anchored */}
        <div style={{ flex: 1, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
          <SectionTitle>FP Anchored vs Not</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MiniDonut data={fpAnchoredData} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fpAnchoredData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i], flexShrink: 0 }} />
                  <span style={{ color: T.textMid, minWidth: 110 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Size Band */}
      <div style={{ marginTop: 16, background: T.white, border: `1px solid ${T.borderLight}`, padding: "16px 20px" }}>
        <SectionTitle>Transaction Size Distribution</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={transactionSizeData} margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: T.textMid, fontFamily: "'Source Sans 3', sans-serif" }} axisLine={{ stroke: T.borderLight }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: T.textLight }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: T.textLight }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v, name) => name === "value" ? fmt(v) : v} contentStyle={{ fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'Source Sans 3', sans-serif" }} />
            <Bar yAxisId="left" dataKey="value" name="Total Value" fill={T.navy} radius={[3, 3, 0, 0]} barSize={40} />
            <Bar yAxisId="right" dataKey="count" name="# Transactions" fill={T.border} radius={[3, 3, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MF Sales Detail */}
      <div style={{ marginTop: 16, background: T.white, border: `1px solid ${T.borderLight}` }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.borderLight}` }}>
          <SectionTitle>Mutual Fund Sales Detail</SectionTitle>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Fund Name</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Series</th>
                <th style={{ ...thStyle, textAlign: "right" }}>YTD Sales</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Clients</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Avg Size</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Trail (%)</th>
              </tr>
            </thead>
            <tbody>
              {mfSalesList.map((f, i) => (
                <tr key={i} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = T.white}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: T.navy }}>{f.fund}</td>
                  <td style={{ ...tdStyle, color: T.textMid, fontFamily: "'Source Code Pro', monospace", fontSize: 12 }}>{f.code}</td>
                  <td style={tdStyle}><span style={{ background: T.blueLight, color: T.navy, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>{f.series}</span></td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{fmtFull(f.ytdSales)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{f.clients}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{fmtFull(f.avgSize)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{f.trailing.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Page: Comp Intel ───
const competitorInstitutions = [
  { name: "TD Asset Management", prsCount: 6, gpxCount: 4, topFunds: ["TD Balanced Growth Fund", "TD Canadian Equity Fund", "TD Monthly Income Fund"], totalAUA: 1240000 },
  { name: "Fidelity Investments", prsCount: 4, gpxCount: 5, topFunds: ["Fidelity Canadian Balanced Fund", "Fidelity Global Fund", "Fidelity NorthStar Fund"], totalAUA: 980000 },
  { name: "Manulife Investments", prsCount: 5, gpxCount: 2, topFunds: ["Manulife Strategic Income Fund", "Manulife Balanced Fund"], totalAUA: 720000 },
  { name: "BMO Global Asset Mgmt", prsCount: 3, gpxCount: 3, topFunds: ["BMO Balanced ETF Portfolio", "BMO Monthly Income Fund", "BMO Canadian Dividend Fund"], totalAUA: 610000 },
  { name: "CI Global Asset Mgmt", prsCount: 2, gpxCount: 2, topFunds: ["CI Canadian Investment Fund", "CI Select Income Managed Corp"], totalAUA: 385000 },
  { name: "Sun Life Global Investments", prsCount: 2, gpxCount: 1, topFunds: ["Sun Life Granite Balanced Portfolio"], totalAUA: 210000 },
];

const competitorFunds = [
  { fund: "TD Balanced Growth Fund", institution: "TD", frequency: 5, avgBalance: 82000, rbcEquiv: "RBC Select Balanced Portfolio", merDiff: "+0.12%" },
  { fund: "Fidelity Canadian Balanced Fund", institution: "Fidelity", frequency: 4, avgBalance: 95000, rbcEquiv: "RBC Balanced Fund", merDiff: "+0.08%" },
  { fund: "Fidelity Global Fund", institution: "Fidelity", frequency: 4, avgBalance: 68000, rbcEquiv: "RBC Global Equity Focus Fund", merDiff: "+0.15%" },
  { fund: "TD Monthly Income Fund", institution: "TD", frequency: 3, avgBalance: 120000, rbcEquiv: "RBC Canadian Dividend Fund", merDiff: "-0.05%" },
  { fund: "Manulife Strategic Income Fund", institution: "Manulife", frequency: 3, avgBalance: 54000, rbcEquiv: "RBC Bond Fund", merDiff: "+0.22%" },
  { fund: "BMO Balanced ETF Portfolio", institution: "BMO", frequency: 3, avgBalance: 72000, rbcEquiv: "RBC Select Balanced Portfolio", merDiff: "-0.35%" },
  { fund: "Manulife Balanced Fund", institution: "Manulife", frequency: 2, avgBalance: 88000, rbcEquiv: "RBC Balanced Fund", merDiff: "+0.10%" },
  { fund: "CI Canadian Investment Fund", institution: "CI", frequency: 2, avgBalance: 61000, rbcEquiv: "RBC Canadian Dividend Fund", merDiff: "+0.18%" },
  { fund: "BMO Monthly Income Fund", institution: "BMO", frequency: 2, avgBalance: 45000, rbcEquiv: "RBC Canadian Dividend Fund", merDiff: "+0.03%" },
  { fund: "TD Canadian Equity Fund", institution: "TD", frequency: 2, avgBalance: 76000, rbcEquiv: "RBC Canadian Dividend Fund", merDiff: "+0.09%" },
];

const CompIntelPage = () => {
  const totalCompAUA = competitorInstitutions.reduce((s, c) => s + c.totalAUA, 0);
  const totalSubmissions = competitorInstitutions.reduce((s, c) => s + c.prsCount + c.gpxCount, 0);
  const uniqueInstitutions = competitorInstitutions.length;

  const thStyle = {
    textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.textMid,
    textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `2px solid ${T.border}`,
    fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "10px 12px", fontSize: 13, color: T.text, borderBottom: `1px solid ${T.borderLight}`,
    fontFamily: "'Source Sans 3', sans-serif", verticalAlign: "top",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <StatCard label="Competitor Institutions" value={uniqueInstitutions} sub="Seen in PRS/GPX" accent={T.navy} />
        <StatCard label="Total Submissions" value={totalSubmissions} sub={`${competitorInstitutions.reduce((s, c) => s + c.prsCount, 0)} PRS · ${competitorInstitutions.reduce((s, c) => s + c.gpxCount, 0)} GPX`} accent={T.blue} />
        <StatCard label="Competitor AUA Identified" value={fmt(totalCompAUA)} sub="Across all submissions" accent={T.orange} />
        <StatCard label="Top Competitor" value="TD" sub={`${fmt(competitorInstitutions[0].totalAUA)} identified`} accent={T.red} />
      </div>

      {/* Institution breakdown */}
      <div style={{ marginTop: 16, background: T.white, border: `1px solid ${T.borderLight}` }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.borderLight}` }}>
          <SectionTitle>Institutions from PRS & GPX Submissions</SectionTitle>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Institution</th>
                <th style={{ ...thStyle, textAlign: "center" }}>PRS Mentions</th>
                <th style={{ ...thStyle, textAlign: "center" }}>GPX Mentions</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Est. Competitor AUA</th>
                <th style={thStyle}>Top Funds Seen</th>
              </tr>
            </thead>
            <tbody>
              {competitorInstitutions.map((inst, i) => (
                <tr key={i} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = T.white}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: T.navy }}>{inst.name}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span style={{ background: T.blueLight, color: T.navy, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{inst.prsCount}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span style={{ background: T.goldLight, color: T.gold, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>{inst.gpxCount}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{fmtFull(inst.totalAUA)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {inst.topFunds.map((f, fi) => (
                        <span key={fi} style={{ fontSize: 11, background: T.bg, color: T.textMid, padding: "2px 8px", borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif" }}>{f}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commonly held competitor funds */}
      <div style={{ marginTop: 16, background: T.white, border: `1px solid ${T.borderLight}` }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.borderLight}` }}>
          <SectionTitle>Commonly Held Competitor Funds</SectionTitle>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Competitor Fund</th>
                <th style={thStyle}>Institution</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Times Seen</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Avg Balance</th>
                <th style={thStyle}>RBC Equivalent</th>
                <th style={{ ...thStyle, textAlign: "right" }}>MER Diff</th>
              </tr>
            </thead>
            <tbody>
              {competitorFunds.map((f, i) => {
                const merVal = parseFloat(f.merDiff);
                return (
                  <tr key={i} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = T.white}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: T.text }}>{f.fund}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3, background: T.redLight, color: T.red }}>{f.institution}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700 }}>{f.frequency}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{fmtFull(f.avgBalance)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: T.navy }}>{f.rbcEquiv}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: merVal > 0 ? T.green : T.red }}>
                      {f.merDiff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 20px", fontSize: 10, color: T.textLight, fontFamily: "'Source Sans 3', sans-serif", borderTop: `1px solid ${T.borderLight}` }}>
            MER Diff = competitor MER minus RBC equivalent MER. Positive = competitor is more expensive.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page: Fund List ───
const rbcFunds = [
  { code: "RBF572", name: "RBC Select Balanced Portfolio", category: "Balanced", series: "A", mer: 1.98, ytd: 4.2, y1: 8.7, y3: 5.4, y5: 6.1, eq: 60, fi: 35, cash: 5, risk: "Low-Med" },
  { code: "RBF571", name: "RBC Select Conservative Portfolio", category: "Conservative", series: "A", mer: 1.85, ytd: 2.8, y1: 6.2, y3: 3.9, y5: 4.3, eq: 35, fi: 55, cash: 10, risk: "Low" },
  { code: "RBF573", name: "RBC Select Growth Portfolio", category: "Growth", series: "A", mer: 2.08, ytd: 5.9, y1: 11.4, y3: 6.8, y5: 7.9, eq: 80, fi: 17, cash: 3, risk: "Medium" },
  { code: "RBF266", name: "RBC Canadian Dividend Fund", category: "Cdn Equity", series: "A", mer: 1.72, ytd: 3.8, y1: 9.1, y3: 7.2, y5: 8.0, eq: 92, fi: 3, cash: 5, risk: "Medium" },
  { code: "RBF140", name: "RBC Bond Fund", category: "Fixed Income", series: "A", mer: 1.12, ytd: 1.4, y1: 4.8, y3: 1.9, y5: 2.1, eq: 0, fi: 95, cash: 5, risk: "Low" },
  { code: "RBF617", name: "RBC Global Equity Focus Fund", category: "Global Equity", series: "A", mer: 2.15, ytd: 7.1, y1: 14.2, y3: 9.1, y5: 10.3, eq: 97, fi: 0, cash: 3, risk: "Med-High" },
  { code: "RBF220", name: "RBC Canadian Short-Term Income", category: "Fixed Income", series: "A", mer: 0.98, ytd: 1.1, y1: 4.1, y3: 2.2, y5: 2.0, eq: 0, fi: 90, cash: 10, risk: "Low" },
  { code: "RBF290", name: "RBC Balanced Fund", category: "Balanced", series: "A", mer: 1.92, ytd: 3.5, y1: 7.9, y3: 5.0, y5: 5.8, eq: 55, fi: 40, cash: 5, risk: "Low-Med" },
  { code: "RBF570", name: "RBC Select Very Conservative", category: "Conservative", series: "A", mer: 1.72, ytd: 1.9, y1: 5.0, y3: 3.1, y5: 3.4, eq: 20, fi: 65, cash: 15, risk: "Low" },
  { code: "RBF275", name: "RBC U.S. Equity Fund", category: "US Equity", series: "A", mer: 1.88, ytd: 6.5, y1: 13.8, y3: 8.5, y5: 11.2, eq: 98, fi: 0, cash: 2, risk: "Med-High" },
  { code: "RBF636", name: "RBC Target 2030 Education Fund", category: "Target Date", series: "A", mer: 1.55, ytd: 3.1, y1: 6.8, y3: 4.5, y5: 5.2, eq: 50, fi: 45, cash: 5, risk: "Low-Med" },
  { code: "RBF556", name: "RBC QSOX Canadian Equity Fund", category: "Cdn Equity", series: "A", mer: 1.68, ytd: 4.5, y1: 10.2, y3: 7.8, y5: 8.5, eq: 95, fi: 0, cash: 5, risk: "Medium" },
];

const thirdPartyFunds = [
  { code: "TDB162", name: "TD Balanced Growth Fund", institution: "TD", mer: 2.10, ytd: 3.9, y1: 8.1, y3: 5.0, y5: 5.7, eq: 58, fi: 37, cash: 5, risk: "Low-Med" },
  { code: "FID230", name: "Fidelity Canadian Balanced", institution: "Fidelity", mer: 2.06, ytd: 4.0, y1: 8.5, y3: 5.2, y5: 6.0, eq: 62, fi: 33, cash: 5, risk: "Low-Med" },
  { code: "FID540", name: "Fidelity Global Fund", institution: "Fidelity", mer: 2.30, ytd: 6.8, y1: 13.5, y3: 8.7, y5: 9.8, eq: 96, fi: 0, cash: 4, risk: "Med-High" },
  { code: "MLI420", name: "Manulife Strategic Income", institution: "Manulife", mer: 1.34, ytd: 1.8, y1: 5.2, y3: 2.4, y5: 2.5, eq: 5, fi: 88, cash: 7, risk: "Low" },
  { code: "BMO720", name: "BMO Balanced ETF Portfolio", institution: "BMO", mer: 1.63, ytd: 3.7, y1: 7.8, y3: 4.8, y5: 5.5, eq: 60, fi: 35, cash: 5, risk: "Low-Med" },
  { code: "TDB850", name: "TD Monthly Income Fund", institution: "TD", mer: 1.67, ytd: 3.2, y1: 8.8, y3: 6.9, y5: 7.5, eq: 45, fi: 40, cash: 15, risk: "Low-Med" },
  { code: "CIG680", name: "CI Canadian Investment Fund", institution: "CI", mer: 1.90, ytd: 4.1, y1: 9.5, y3: 7.0, y5: 7.8, eq: 90, fi: 5, cash: 5, risk: "Medium" },
  { code: "MLI300", name: "Manulife Balanced Fund", institution: "Manulife", mer: 2.02, ytd: 3.3, y1: 7.5, y3: 4.7, y5: 5.4, eq: 57, fi: 38, cash: 5, risk: "Low-Med" },
];

const FundListPage = () => {
  const [tab, setTab] = useState("fees");
  const [pinnedCodes, setPinnedCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showThirdParty, setShowThirdParty] = useState(false);

  const togglePin = (code) => {
    setPinnedCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const filteredThirdParty = thirdPartyFunds.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allDisplayed = [
    ...rbcFunds.filter(f => pinnedCodes.includes(f.code)).map(f => ({ ...f, pinned: true, source: "RBC" })),
    ...thirdPartyFunds.filter(f => pinnedCodes.includes(f.code)).map(f => ({ ...f, pinned: true, source: f.institution })),
    ...rbcFunds.filter(f => !pinnedCodes.includes(f.code)).map(f => ({ ...f, pinned: false, source: "RBC" })),
  ];

  const thStyle = {
    textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: T.textMid,
    textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `2px solid ${T.border}`,
    fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "10px 12px", fontSize: 13, color: T.text, borderBottom: `1px solid ${T.borderLight}`,
    fontFamily: "'Source Sans 3', sans-serif",
  };

  const renderFeesCols = (f) => (
    <>
      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{f.mer.toFixed(2)}%</td>
      <td style={tdStyle}>{f.series || "—"}</td>
      <td style={tdStyle}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3,
          background: f.risk === "Low" ? T.greenLight : f.risk === "Low-Med" ? T.blueLight : f.risk === "Medium" ? T.orangeLight : T.redLight,
          color: f.risk === "Low" ? T.green : f.risk === "Low-Med" ? T.blue : f.risk === "Medium" ? T.orange : T.red,
        }}>{f.risk}</span>
      </td>
    </>
  );

  const renderPerfCols = (f) => (
    <>
      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: f.ytd >= 0 ? T.green : T.red }}>{f.ytd > 0 ? "+" : ""}{f.ytd}%</td>
      <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: f.y1 >= 0 ? T.green : T.red }}>{f.y1 > 0 ? "+" : ""}{f.y1}%</td>
      <td style={{ ...tdStyle, textAlign: "right", color: T.textMid }}>{f.y3 > 0 ? "+" : ""}{f.y3}%</td>
      <td style={{ ...tdStyle, textAlign: "right", color: T.textMid }}>{f.y5 > 0 ? "+" : ""}{f.y5}%</td>
    </>
  );

  const renderMixCols = (f) => (
    <>
      <td style={{ ...tdStyle, width: 200 }}>
        <div style={{ display: "flex", height: 16, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${f.eq}%`, background: T.navy, transition: "width 0.3s" }} />
          <div style={{ width: `${f.fi}%`, background: T.blue, transition: "width 0.3s" }} />
          <div style={{ width: `${f.cash}%`, background: T.border, transition: "width 0.3s" }} />
        </div>
      </td>
      <td style={{ ...tdStyle, textAlign: "right" }}>{f.eq}%</td>
      <td style={{ ...tdStyle, textAlign: "right" }}>{f.fi}%</td>
      <td style={{ ...tdStyle, textAlign: "right" }}>{f.cash}%</td>
    </>
  );

  const tabHeaders = {
    fees: (
      <>
        <th style={{ ...thStyle, textAlign: "right" }}>MER</th>
        <th style={thStyle}>Series</th>
        <th style={thStyle}>Risk</th>
      </>
    ),
    performance: (
      <>
        <th style={{ ...thStyle, textAlign: "right" }}>YTD</th>
        <th style={{ ...thStyle, textAlign: "right" }}>1 Yr</th>
        <th style={{ ...thStyle, textAlign: "right" }}>3 Yr</th>
        <th style={{ ...thStyle, textAlign: "right" }}>5 Yr</th>
      </>
    ),
    mix: (
      <>
        <th style={thStyle}>Allocation</th>
        <th style={{ ...thStyle, textAlign: "right" }}>Equity</th>
        <th style={{ ...thStyle, textAlign: "right" }}>Fixed Inc</th>
        <th style={{ ...thStyle, textAlign: "right" }}>Cash</th>
      </>
    ),
  };

  const renderRow = (f) => {
    if (tab === "fees") return renderFeesCols(f);
    if (tab === "performance") return renderPerfCols(f);
    return renderMixCols(f);
  };

  return (
    <div>
      {/* Tab bar + search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "fees", label: "Fees" }, { id: "performance", label: "Performance" }, { id: "mix", label: "Asset Mix" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 20px", fontSize: 13, fontWeight: 600, border: `1px solid ${tab === t.id ? T.blue : T.border}`,
              background: tab === t.id ? T.blueLight : T.white, color: tab === t.id ? T.navy : T.textMid,
              borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {pinnedCodes.length > 0 && (
            <span style={{ fontSize: 11, color: T.gold, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
              📌 {pinnedCodes.length} pinned
            </span>
          )}
          <button onClick={() => setShowThirdParty(!showThirdParty)} style={{
            padding: "7px 16px", fontSize: 12, fontWeight: 600,
            border: `1px solid ${showThirdParty ? T.navy : T.border}`,
            background: showThirdParty ? T.navy : T.white,
            color: showThirdParty ? T.white : T.textMid,
            borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
          }}>
            {showThirdParty ? "✕ Close Search" : "🔍 Search 3rd Party Funds"}
          </button>
        </div>
      </div>

      {/* 3rd party search panel */}
      {showThirdParty && (
        <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>3rd Party Fund Search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by fund name, institution, or code..."
              style={{
                flex: 1, padding: "8px 14px", fontSize: 13, border: `1px solid ${T.border}`,
                borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif", outline: "none",
              }}
            />
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {filteredThirdParty.map((f, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderBottom: `1px solid ${T.borderLight}`,
                background: pinnedCodes.includes(f.code) ? T.goldLight : T.white,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'Source Sans 3', sans-serif" }}>{f.name}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: T.textLight, fontFamily: "'Source Code Pro', monospace" }}>{f.code}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: T.red, background: T.redLight, padding: "0 6px", borderRadius: 2 }}>{f.institution}</span>
                    <span style={{ fontSize: 10, color: T.textMid }}>MER {f.mer.toFixed(2)}%</span>
                  </div>
                </div>
                <button onClick={() => togglePin(f.code)} style={{
                  padding: "5px 14px", fontSize: 11, fontWeight: 600, border: `1px solid ${pinnedCodes.includes(f.code) ? T.gold : T.border}`,
                  background: pinnedCodes.includes(f.code) ? T.goldLight : T.white,
                  color: pinnedCodes.includes(f.code) ? T.gold : T.textMid,
                  borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
                }}>
                  {pinnedCodes.includes(f.code) ? "📌 Pinned" : "Pin"}
                </button>
              </div>
            ))}
            {filteredThirdParty.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: T.textLight }}>No matching funds found</div>
            )}
          </div>
        </div>
      )}

      {/* Main fund table */}
      <div style={{ background: T.white, border: `1px solid ${T.borderLight}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40 }}></th>
                <th style={thStyle}>Fund Name</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Category</th>
                {tabHeaders[tab]}
              </tr>
            </thead>
            <tbody>
              {allDisplayed.map((f, i) => {
                const isPinned = pinnedCodes.includes(f.code);
                const isThirdParty = f.source !== "RBC";
                return (
                  <tr key={f.code + i}
                    style={{ transition: "background 0.15s", background: isPinned ? T.goldLight : T.white }}
                    onMouseEnter={e => { if (!isPinned) e.currentTarget.style.background = T.bg; }}
                    onMouseLeave={e => { if (!isPinned) e.currentTarget.style.background = isPinned ? T.goldLight : T.white; }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center", cursor: "pointer" }} onClick={() => togglePin(f.code)}>
                      <span style={{ fontSize: 14, opacity: isPinned ? 1 : 0.3 }}>{isPinned ? "📌" : "○"}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: isThirdParty ? T.text : T.navy }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {f.name}
                        {isThirdParty && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 2, background: T.redLight, color: T.red }}>{f.source}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: T.textMid, fontFamily: "'Source Code Pro', monospace", fontSize: 12 }}>{f.code}</td>
                    <td style={tdStyle}>{f.category || "—"}</td>
                    {renderRow(f)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Page: Fund Events ───
const FundEventsPage = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500, background: T.white, border: `1px solid ${T.borderLight}` }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, color: T.border, marginBottom: 12 }}>📅</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif" }}>Fund Events</div>
      <div style={{ fontSize: 13, color: T.textLight, marginTop: 6, fontFamily: "'Source Sans 3', sans-serif" }}>Coming soon — distribution dates, capital gains estimates, fund changes & alerts</div>
    </div>
  </div>
);

// ─── Page: Workflows ───
const AVAILABLE_TOOLS = ["PRS", "GPX", "IPS", "PI", "MER", "Buckets", "Conquest", "MyAdvisor", "Client360"];
const AVAILABLE_DOCS = ["KYC Form", "Account Application", "Fund Facts", "Switch Form", "Suitability Letter", "RRIF Election Form", "Beneficiary Form", "RESP Application", "FHSA Application", "Client Meeting Notes", "Financial Plan Summary", "Risk Questionnaire"];

const defaultTemplates = [
  {
    id: "t1", name: "New Client Onboarding", description: "End-to-end process for bringing on a new client from first meeting to funded accounts.",
    steps: [
      { id: "s1", title: "Discovery Meeting", desc: "Understand client goals, family situation, risk tolerance, and existing holdings.", tools: ["Conquest", "Client360"], docs: ["Client Meeting Notes", "Risk Questionnaire"], status: "not_started" },
      { id: "s2", title: "Complete KYC & Suitability", desc: "Fill out Know Your Client form and assess suitability. Confirm all regulatory requirements.", tools: ["Client360"], docs: ["KYC Form", "Suitability Letter"], status: "not_started" },
      { id: "s3", title: "Run PRS & GPX", desc: "Pull existing statements via PRS. Run Gap Exchange to identify held-away assets and competitor funds.", tools: ["PRS", "GPX"], docs: [], status: "not_started" },
      { id: "s4", title: "Build Financial Plan", desc: "Create comprehensive plan in Conquest covering retirement, education, insurance needs.", tools: ["Conquest", "IPS"], docs: ["Financial Plan Summary"], status: "not_started" },
      { id: "s5", title: "Present Recommendations", desc: "Review plan with client. Walk through fund recommendations and account structure.", tools: ["MyAdvisor", "MER", "Buckets"], docs: ["Fund Facts"], status: "not_started" },
      { id: "s6", title: "Open Accounts & Fund", desc: "Process account applications, set up PACs if applicable, submit initial trades.", tools: ["Client360"], docs: ["Account Application", "Fund Facts"], status: "not_started" },
    ]
  },
  {
    id: "t2", name: "Annual Review", description: "Yearly check-in covering performance, life changes, rebalancing, and plan updates.",
    steps: [
      { id: "s1", title: "Pre-Meeting Prep", desc: "Review portfolio performance, upcoming distributions, and any flagged gaps.", tools: ["Client360", "MER"], docs: ["Client Meeting Notes"], status: "not_started" },
      { id: "s2", title: "Run Updated PRS", desc: "Refresh held-away asset picture. Check if competitor holdings have changed.", tools: ["PRS", "GPX"], docs: [], status: "not_started" },
      { id: "s3", title: "Life Changes Check", desc: "Ask about job changes, family events, property, health. Update KYC if needed.", tools: ["Client360"], docs: ["KYC Form"], status: "not_started" },
      { id: "s4", title: "Update Financial Plan", desc: "Refresh Conquest plan with new info. Re-run projections.", tools: ["Conquest", "IPS"], docs: ["Financial Plan Summary"], status: "not_started" },
      { id: "s5", title: "Rebalance & Execute", desc: "Recommend switches or new contributions. Process any trades.", tools: ["Buckets", "MER"], docs: ["Switch Form", "Fund Facts"], status: "not_started" },
    ]
  },
  {
    id: "t3", name: "RRIF Conversion", description: "Guide client through RRSP-to-RRIF conversion before age 71 deadline.",
    steps: [
      { id: "s1", title: "Review RRSP Holdings", desc: "Assess current allocation. Flag any equity-heavy positions that should shift for income.", tools: ["Client360", "MER"], docs: [], status: "not_started" },
      { id: "s2", title: "Model Withdrawal Strategy", desc: "Use Conquest to project minimum withdrawals, OAS clawback risk, income splitting options.", tools: ["Conquest", "Buckets"], docs: ["Financial Plan Summary"], status: "not_started" },
      { id: "s3", title: "Discuss with Client", desc: "Present options: minimum vs higher withdrawals, timing of conversion, beneficiary review.", tools: ["MyAdvisor"], docs: ["RRIF Election Form", "Beneficiary Form"], status: "not_started" },
      { id: "s4", title: "Process Conversion", desc: "Submit RRIF election form. Reallocate holdings if needed. Set up withdrawal schedule.", tools: ["Client360"], docs: ["RRIF Election Form", "Switch Form"], status: "not_started" },
    ]
  },
  {
    id: "t4", name: "RESP Setup", description: "Open an RESP for a client with children and maximize CESG.",
    steps: [
      { id: "s1", title: "Confirm Eligibility", desc: "Verify child's SIN, age, residency. Discuss contribution room and CESG.", tools: ["Conquest"], docs: ["RESP Application"], status: "not_started" },
      { id: "s2", title: "Fund Selection", desc: "Recommend age-appropriate target date fund or balanced portfolio.", tools: ["MER", "Buckets"], docs: ["Fund Facts"], status: "not_started" },
      { id: "s3", title: "Open & Fund Account", desc: "Process application, set up PAC for ongoing contributions.", tools: ["Client360"], docs: ["RESP Application", "Account Application"], status: "not_started" },
    ]
  },
];

// Tool & document link mappings
const TOOL_LINKS = {
  PRS: { url: "https://prs.rbcgam.com", label: "PRS Portal" },
  GPX: { url: "https://gpx.rbcgam.com", label: "Gap Exchange" },
  IPS: { url: "https://ips.rbcgam.com", label: "Investment Policy" },
  PI: { url: "https://pi.rbcgam.com", label: "Portfolio Insights" },
  MER: { url: "https://mer.rbcgam.com", label: "MER Comparison" },
  Buckets: { url: "https://buckets.rbcgam.com", label: "Bucket Strategy" },
  Conquest: { url: "https://conquest.rbcfinancialplanning.com", label: "Conquest Planning" },
  MyAdvisor: { url: "https://myadvisor.rbc.com", label: "MyAdvisor Portal" },
  Client360: { url: "https://client360.rbc.com", label: "Client360 CRM" },
};

const DOC_LINKS = {
  "KYC Form": { url: "https://forms.rbc.com/kyc", label: "KYC Form" },
  "Account Application": { url: "https://forms.rbc.com/account-app", label: "Account Application" },
  "Fund Facts": { url: "https://www.rbcgam.com/en/ca/fund-facts", label: "Fund Facts Library" },
  "Switch Form": { url: "https://forms.rbc.com/switch", label: "Switch Form" },
  "Suitability Letter": { url: "https://forms.rbc.com/suitability", label: "Suitability Letter" },
  "RRIF Election Form": { url: "https://forms.rbc.com/rrif-election", label: "RRIF Election" },
  "Beneficiary Form": { url: "https://forms.rbc.com/beneficiary", label: "Beneficiary Designation" },
  "RESP Application": { url: "https://forms.rbc.com/resp", label: "RESP Application" },
  "FHSA Application": { url: "https://forms.rbc.com/fhsa", label: "FHSA Application" },
  "Client Meeting Notes": { url: "https://client360.rbc.com/notes", label: "Meeting Notes (CRM)" },
  "Financial Plan Summary": { url: "https://conquest.rbcfinancialplanning.com/plans", label: "Conquest Plans" },
  "Risk Questionnaire": { url: "https://forms.rbc.com/risk-profile", label: "Risk Questionnaire" },
};

let stepCounter = 100;

const WorkflowsPage = () => {
  const preloaded = {
    id: "w_demo",
    name: "New Client Onboarding",
    description: "End-to-end process for bringing on a new client from first meeting to funded accounts.",
    linkedType: "client",
    clientId: "C-10042",
    steps: [
      { id: "sd1", title: "Discovery Meeting", desc: "Understand client goals, family situation, risk tolerance, and existing holdings.", tools: ["Conquest", "Client360"], docs: ["Client Meeting Notes", "Risk Questionnaire"], status: "complete" },
      { id: "sd2", title: "Complete KYC & Suitability", desc: "Fill out Know Your Client form and assess suitability. Confirm all regulatory requirements.", tools: ["Client360"], docs: ["KYC Form", "Suitability Letter"], status: "complete" },
      { id: "sd3", title: "Run PRS & GPX", desc: "Pull existing statements via PRS. Run Gap Exchange to identify held-away assets and competitor funds.", tools: ["PRS", "GPX"], docs: [], status: "in_progress" },
      { id: "sd4", title: "Build Financial Plan", desc: "Create comprehensive plan in Conquest covering retirement, education, insurance needs.", tools: ["Conquest", "IPS"], docs: ["Financial Plan Summary"], status: "not_started" },
      { id: "sd5", title: "Present Recommendations", desc: "Review plan with client. Walk through fund recommendations and account structure.", tools: ["MyAdvisor", "MER", "Buckets"], docs: ["Fund Facts"], status: "not_started" },
      { id: "sd6", title: "Open Accounts & Fund", desc: "Process account applications, set up PACs if applicable, submit initial trades.", tools: ["Client360"], docs: ["Account Application", "Fund Facts"], status: "not_started" },
    ]
  };
  const [workflows, setWorkflows] = useState([preloaded]);
  const [activeId, setActiveId] = useState("w_demo");
  const [editingStepId, setEditingStepId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [pendingCreation, setPendingCreation] = useState(null); // { source: "template" | "blank", template?: obj }
  const [creationLinkedType, setCreationLinkedType] = useState(null); // "prospect" | "client"
  const [creationClientId, setCreationClientId] = useState("");

  const activeFlow = workflows.find(w => w.id === activeId);

  const startCreation = (source, template) => {
    setPendingCreation({ source, template });
    setCreationLinkedType(null);
    setCreationClientId("");
  };

  const confirmCreation = () => {
    if (!creationLinkedType) return;
    if (creationLinkedType === "client" && !creationClientId.trim()) return;
    const linkedFields = { linkedType: creationLinkedType, clientId: creationLinkedType === "client" ? creationClientId.trim() : null };
    if (pendingCreation.source === "template") {
      const t = pendingCreation.template;
      const newFlow = {
        ...t,
        id: "w" + Date.now(),
        name: t.name,
        ...linkedFields,
        steps: t.steps.map(s => ({ ...s, id: "s" + (++stepCounter), status: "not_started" })),
      };
      setWorkflows(prev => [...prev, newFlow]);
      setActiveId(newFlow.id);
    } else {
      const newFlow = {
        id: "w" + Date.now(),
        name: "Untitled Workflow",
        description: "",
        ...linkedFields,
        steps: [{ id: "s" + (++stepCounter), title: "Step 1", desc: "", tools: [], docs: [], status: "not_started" }],
      };
      setWorkflows(prev => [...prev, newFlow]);
      setActiveId(newFlow.id);
    }
    setPendingCreation(null);
    setCreationLinkedType(null);
    setCreationClientId("");
    setShowTemplates(false);
  };

  const cancelCreation = () => {
    setPendingCreation(null);
    setCreationLinkedType(null);
    setCreationClientId("");
  };

  const cloneTemplate = (t) => {
    startCreation("template", t);
  };

  const createBlank = () => {
    startCreation("blank", null);
  };

  const updateFlow = (updater) => {
    setWorkflows(prev => prev.map(w => w.id === activeId ? updater(w) : w));
  };

  const addStep = () => {
    updateFlow(w => ({
      ...w,
      steps: [...w.steps, { id: "s" + (++stepCounter), title: `Step ${w.steps.length + 1}`, desc: "", tools: [], docs: [], status: "not_started" }],
    }));
  };

  const deleteStep = (stepId) => {
    updateFlow(w => ({ ...w, steps: w.steps.filter(s => s.id !== stepId) }));
  };

  const moveStep = (stepId, dir) => {
    updateFlow(w => {
      const idx = w.steps.findIndex(s => s.id === stepId);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === w.steps.length - 1)) return w;
      const newSteps = [...w.steps];
      [newSteps[idx], newSteps[idx + dir]] = [newSteps[idx + dir], newSteps[idx]];
      return { ...w, steps: newSteps };
    });
  };

  const updateStep = (stepId, field, value) => {
    updateFlow(w => ({
      ...w,
      steps: w.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s),
    }));
  };

  const toggleStepItem = (stepId, field, item) => {
    updateFlow(w => ({
      ...w,
      steps: w.steps.map(s => {
        if (s.id !== stepId) return s;
        const arr = s[field];
        return { ...s, [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] };
      }),
    }));
  };

  const cycleStatus = (stepId) => {
    const order = ["not_started", "in_progress", "complete"];
    updateFlow(w => ({
      ...w,
      steps: w.steps.map(s => {
        if (s.id !== stepId) return s;
        const next = order[(order.indexOf(s.status) + 1) % order.length];
        return { ...s, status: next };
      }),
    }));
  };

  const statusStyle = (status) => {
    if (status === "complete") return { bg: T.greenLight, color: T.green, label: "Complete" };
    if (status === "in_progress") return { bg: T.orangeLight, color: T.orange, label: "In Progress" };
    return { bg: T.bg, color: T.textLight, label: "Not Started" };
  };

  const deleteWorkflow = (wId) => {
    setWorkflows(prev => prev.filter(w => w.id !== wId));
    if (activeId === wId) setActiveId(null);
  };

  // Prospect / Client selection modal
  const renderLinkSelection = () => {
    if (!pendingCreation) return null;
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}>
        <div style={{
          background: T.white, borderRadius: 6, padding: "28px 32px", width: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          fontFamily: "'Source Sans 3', sans-serif",
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.navy, marginBottom: 4 }}>Link this Workflow</div>
          <div style={{ fontSize: 12, color: T.textMid, marginBottom: 20, lineHeight: 1.4 }}>
            Each workflow must be tied to a Prospect or an existing Client.
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {["prospect", "client"].map(type => {
              const active = creationLinkedType === type;
              return (
                <button key={type} onClick={() => { setCreationLinkedType(type); setCreationClientId(""); }} style={{
                  flex: 1, padding: "14px 16px", borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
                  border: `2px solid ${active ? T.blue : T.border}`,
                  background: active ? T.blueLight : T.white,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{type === "prospect" ? "👤" : "🏦"}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? T.navy : T.textMid }}>
                    {type === "prospect" ? "Prospect" : "Client"}
                  </div>
                  <div style={{ fontSize: 11, color: T.textLight, marginTop: 2 }}>
                    {type === "prospect" ? "New or potential client" : "Existing client with ID"}
                  </div>
                </button>
              );
            })}
          </div>

          {creationLinkedType === "client" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                Client ID
              </label>
              <input
                value={creationClientId}
                onChange={e => setCreationClientId(e.target.value)}
                placeholder="e.g. C-10042"
                autoFocus
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 13, border: `1px solid ${T.border}`,
                  borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.currentTarget.style.borderColor = T.blue}
                onBlur={e => e.currentTarget.style.borderColor = T.border}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={cancelCreation} style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`,
              background: T.white, color: T.textMid, borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
            }}>Cancel</button>
            <button
              onClick={confirmCreation}
              disabled={!creationLinkedType || (creationLinkedType === "client" && !creationClientId.trim())}
              style={{
                padding: "8px 20px", fontSize: 12, fontWeight: 600, border: "none",
                background: (!creationLinkedType || (creationLinkedType === "client" && !creationClientId.trim())) ? T.border : T.navy,
                color: T.white, borderRadius: 3, cursor: (!creationLinkedType || (creationLinkedType === "client" && !creationClientId.trim())) ? "not-allowed" : "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >Create Workflow</button>
          </div>
        </div>
      </div>
    );
  };

  // Template / empty state
  if (showTemplates || workflows.length === 0) {
    return (
      <div>
        {renderLinkSelection()}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>Start from a Template</div>
            <div style={{ fontSize: 12, color: T.textLight, fontFamily: "'Source Sans 3', sans-serif", marginTop: 2 }}>Clone a template and customize it for your process, or start blank.</div>
          </div>
          {workflows.length > 0 && (
            <button onClick={() => setShowTemplates(false)} style={{
              padding: "7px 16px", fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`,
              background: T.white, color: T.textMid, borderRadius: 3, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
            }}>← Back to My Workflows</button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {defaultTemplates.map(t => (
            <div key={t.id} style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: 4, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.borderLight}
              onClick={() => cloneTemplate(t)}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 10, lineHeight: 1.4 }}>{t.description}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {t.steps.map((s, i) => (
                  <span key={i} style={{ fontSize: 10, background: T.blueLight, color: T.navy, padding: "2px 8px", borderRadius: 10, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>
                    {i + 1}. {s.title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={createBlank} style={{
          padding: "10px 24px", fontSize: 13, fontWeight: 600, border: `2px dashed ${T.border}`,
          background: T.white, color: T.textMid, borderRadius: 4, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", width: "100%",
        }}>+ Start Blank Workflow</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 120px)" }}>
      {renderLinkSelection()}
      {/* Left: workflow list */}
      <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {workflows.map(w => {
          const completed = w.steps.filter(s => s.status === "complete").length;
          return (
            <div key={w.id} onClick={() => setActiveId(w.id)} style={{
              padding: "12px 14px", background: activeId === w.id ? T.blueLight : T.white,
              border: `1px solid ${activeId === w.id ? T.blue : T.borderLight}`, borderRadius: 4, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>{w.name}</div>
                <span onClick={(e) => { e.stopPropagation(); deleteWorkflow(w.id); }} style={{ fontSize: 11, color: T.textLight, cursor: "pointer", padding: "2px 4px" }}>✕</span>
              </div>
              {w.linkedType && (
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 3,
                    background: w.linkedType === "client" ? T.greenLight : T.orangeLight,
                    color: w.linkedType === "client" ? T.green : T.orange,
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}>
                    {w.linkedType === "client" ? "Client" : "Prospect"}
                  </span>
                  {w.linkedType === "client" && w.clientId && (
                    <span style={{ fontSize: 10, color: T.textLight, fontFamily: "'Source Code Pro', monospace" }}>{w.clientId}</span>
                  )}
                </div>
              )}
              <div style={{ fontSize: 11, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif", marginTop: 3 }}>
                {completed}/{w.steps.length} steps complete
              </div>
              <div style={{ height: 4, background: T.bg, borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                <div style={{ width: `${(completed / w.steps.length) * 100}%`, height: "100%", background: T.green, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
        <button onClick={() => setShowTemplates(true)} style={{
          padding: "10px 14px", fontSize: 12, fontWeight: 600, border: `2px dashed ${T.border}`,
          background: T.white, color: T.textMid, borderRadius: 4, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
        }}>+ New Workflow</button>
      </div>

      {/* Right: active workflow editor */}
      {activeFlow ? (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Workflow header */}
          <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
            {activeFlow.linkedType && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 3,
                  background: activeFlow.linkedType === "client" ? T.greenLight : T.orangeLight,
                  color: activeFlow.linkedType === "client" ? T.green : T.orange,
                  fontFamily: "'Source Sans 3', sans-serif",
                }}>
                  {activeFlow.linkedType === "client" ? "Client" : "Prospect"}
                </span>
                {activeFlow.linkedType === "client" && activeFlow.clientId && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textMid, fontFamily: "'Source Code Pro', monospace" }}>
                    ID: {activeFlow.clientId}
                  </span>
                )}
              </div>
            )}
            <input
              value={activeFlow.name}
              onChange={e => updateFlow(w => ({ ...w, name: e.target.value }))}
              style={{ fontSize: 18, fontWeight: 700, color: T.navy, border: "none", outline: "none", width: "100%", fontFamily: "'Source Sans 3', sans-serif", background: "transparent" }}
            />
            <input
              value={activeFlow.description}
              onChange={e => updateFlow(w => ({ ...w, description: e.target.value }))}
              placeholder="Add a description..."
              style={{ fontSize: 13, color: T.textMid, border: "none", outline: "none", width: "100%", fontFamily: "'Source Sans 3', sans-serif", marginTop: 4, background: "transparent" }}
            />
          </div>

          {/* Steps */}
          {activeFlow.steps.map((step, idx) => {
            const isEditing = editingStepId === step.id;
            const ss = statusStyle(step.status);
            return (
              <div key={step.id} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                {/* Step number + connector line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                  <div onClick={() => cycleStatus(step.id)} style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    background: step.status === "complete" ? T.green : step.status === "in_progress" ? T.orange : T.white,
                    color: step.status === "not_started" ? T.textMid : T.white,
                    border: `2px solid ${step.status === "complete" ? T.green : step.status === "in_progress" ? T.orange : T.border}`,
                  }}>
                    {step.status === "complete" ? "✓" : idx + 1}
                  </div>
                  {idx < activeFlow.steps.length - 1 && (
                    <div style={{ flex: 1, width: 2, background: T.border, minHeight: 12 }} />
                  )}
                </div>

                {/* Step card */}
                <div style={{
                  flex: 1, background: T.white, border: `1px solid ${isEditing ? T.blue : T.borderLight}`,
                  borderRadius: 4, padding: "14px 18px", cursor: "pointer", transition: "border-color 0.15s",
                }}
                  onClick={() => setEditingStepId(isEditing ? null : step.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      {isEditing ? (
                        <input value={step.title} onChange={e => updateStep(step.id, "title", e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 14, fontWeight: 700, color: T.navy, border: "none", outline: "none", width: "100%", fontFamily: "'Source Sans 3', sans-serif", background: "transparent" }}
                        />
                      ) : (
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: "'Source Sans 3', sans-serif" }}>{step.title}</div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span onClick={(e) => { e.stopPropagation(); cycleStatus(step.id); }} style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10, cursor: "pointer",
                        background: ss.bg, color: ss.color, fontFamily: "'Source Sans 3', sans-serif",
                      }}>{ss.label}</span>
                      <span onClick={(e) => { e.stopPropagation(); moveStep(step.id, -1); }} style={{ fontSize: 12, cursor: "pointer", color: T.textLight, padding: "2px 4px" }}>▲</span>
                      <span onClick={(e) => { e.stopPropagation(); moveStep(step.id, 1); }} style={{ fontSize: 12, cursor: "pointer", color: T.textLight, padding: "2px 4px" }}>▼</span>
                      <span onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }} style={{ fontSize: 12, cursor: "pointer", color: T.textLight, padding: "2px 4px" }}>✕</span>
                    </div>
                  </div>

                  {/* Collapsed: show badges */}
                  {!isEditing && (
                    <div style={{ marginTop: 6 }}>
                      {step.desc && <div style={{ fontSize: 12, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 6, lineHeight: 1.4 }}>{step.desc}</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {step.tools.map(t => (
                          <a key={t} href={TOOL_LINKS[t]?.url || "#"} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, background: T.blueLight, color: T.navy, fontFamily: "'Source Sans 3', sans-serif", textDecoration: "none", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.blue; e.currentTarget.style.color = T.white; }}
                            onMouseLeave={e => { e.currentTarget.style.background = T.blueLight; e.currentTarget.style.color = T.navy; }}
                          >🔧 {t} ↗</a>
                        ))}
                        {step.docs.map(d => (
                          <a key={d} href={DOC_LINKS[d]?.url || "#"} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, background: T.goldLight, color: T.gold, fontFamily: "'Source Sans 3', sans-serif", textDecoration: "none", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = T.white; }}
                            onMouseLeave={e => { e.currentTarget.style.background = T.goldLight; e.currentTarget.style.color = T.gold; }}
                          >📄 {d} ↗</a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded: full editor */}
                  {isEditing && (
                    <div style={{ marginTop: 10 }} onClick={e => e.stopPropagation()}>
                      <textarea value={step.desc} onChange={e => updateStep(step.id, "desc", e.target.value)}
                        placeholder="Describe this step..."
                        rows={2}
                        style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: `1px solid ${T.border}`, borderRadius: 3, fontFamily: "'Source Sans 3', sans-serif", resize: "vertical", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
                      />

                      {/* Tools picker */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.3px" }}>Tools</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {AVAILABLE_TOOLS.map(t => {
                            const active = step.tools.includes(t);
                            return (
                              <button key={t} onClick={() => toggleStepItem(step.id, "tools", t)} style={{
                                fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 3, cursor: "pointer",
                                border: `1px solid ${active ? T.blue : T.border}`,
                                background: active ? T.blueLight : T.white,
                                color: active ? T.navy : T.textLight,
                                fontFamily: "'Source Sans 3', sans-serif",
                              }}>
                                {active ? "✓ " : ""}{t}
                              </button>
                            );
                          })}
                        </div>
                        {step.tools.length > 0 && (
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                            {step.tools.map(t => TOOL_LINKS[t] && (
                              <a key={t} href={TOOL_LINKS[t].url} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: 11, color: T.blue, fontFamily: "'Source Sans 3', sans-serif", textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                              }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                              >
                                <span style={{ fontWeight: 600 }}>🔧 {t}</span>
                                <span style={{ color: T.textLight }}>→ {TOOL_LINKS[t].url}</span>
                                <span>↗</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Docs picker */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMid, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.3px" }}>Documents & Forms</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {AVAILABLE_DOCS.map(d => {
                            const active = step.docs.includes(d);
                            return (
                              <button key={d} onClick={() => toggleStepItem(step.id, "docs", d)} style={{
                                fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 3, cursor: "pointer",
                                border: `1px solid ${active ? T.gold : T.border}`,
                                background: active ? T.goldLight : T.white,
                                color: active ? T.gold : T.textLight,
                                fontFamily: "'Source Sans 3', sans-serif",
                              }}>
                                {active ? "✓ " : ""}{d}
                              </button>
                            );
                          })}
                        </div>
                        {step.docs.length > 0 && (
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                            {step.docs.map(d => DOC_LINKS[d] && (
                              <a key={d} href={DOC_LINKS[d].url} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: 11, color: T.gold, fontFamily: "'Source Sans 3', sans-serif", textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                              }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                              >
                                <span style={{ fontWeight: 600 }}>📄 {d}</span>
                                <span style={{ color: T.textLight }}>→ {DOC_LINKS[d].url}</span>
                                <span>↗</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add step button */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <div style={{ width: 32 }} />
            <button onClick={addStep} style={{
              flex: 1, padding: "12px", fontSize: 13, fontWeight: 600, border: `2px dashed ${T.border}`,
              background: T.white, color: T.textMid, borderRadius: 4, cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif",
            }}>+ Add Step</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: T.textLight, fontFamily: "'Source Sans 3', sans-serif" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>←</div>
            <div style={{ fontSize: 14 }}>Select a workflow to edit</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Nav Items ───
const NAV = [
  { id: "prospects", label: "Prospects", icon: "👤" },
  { id: "trades", label: "Trades", icon: "📈" },
  { id: "fundlist", label: "Fund List", icon: "📋" },
  { id: "fundevents", label: "Fund Events", icon: "📅" },
  { id: "compintel", label: "Comp Intel", icon: "🔍" },
  { id: "workflows", label: "Workflows", icon: "⚙️" },
];

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState("prospects");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Source Sans 3', sans-serif", background: T.bg }}>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap');`}</style>

      {/* Left Nav */}
      <div style={{
        width: 200, background: T.navy, display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Logo area */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, background: "#FFCC00", borderRadius: 4, display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 10, color: T.navy,
              fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1,
            }}>MF</div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 700, lineHeight: 1.2 }}>Asset</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 700, lineHeight: 1.2 }}>Management</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ padding: "12px 0", flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px",
              background: page === n.id ? "rgba(255,255,255,0.12)" : "transparent",
              border: "none", borderLeft: page === n.id ? `3px solid #FFCC00` : "3px solid transparent",
              color: page === n.id ? "#FFFFFF" : "rgba(255,255,255,0.6)", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (page !== n.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (page !== n.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>

        {/* Advisor */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(255,255,255,0.7)",
          }}>👤</div>
          <div>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600 }}>Sarah Mitchell</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>IRP · Toronto Central</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{
          background: T.white, borderBottom: `1px solid ${T.borderLight}`, padding: "12px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.gold, fontFamily: "'Source Sans 3', sans-serif" }}>
              {NAV.find(n => n.id === page)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.textLight }}>As of Feb 9, 2026</span>
            <button style={{
              padding: "6px 16px", fontSize: 12, fontWeight: 600, border: `1px solid ${T.blue}`,
              background: T.white, color: T.blue, borderRadius: 3, cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}>Generate PDF</button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
          {page === "prospects" && <ProspectsPage />}
          {page === "trades" && <TradesPage />}
          {page === "fundlist" && <FundListPage />}
          {page === "fundevents" && <FundEventsPage />}
          {page === "compintel" && <CompIntelPage />}
          {page === "workflows" && <WorkflowsPage />}
        </div>
      </div>
    </div>
  );
}
