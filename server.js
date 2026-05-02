const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "data", "database.json");

// ─── 미들웨어 ───────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── DB 초기화 ──────────────────────────────────────────────
function initDB() {
  const dir = path.join(__dirname, "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const empty = { tasks: [], records: [], templates: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), "utf8");
    console.log("✅ data/database.json 생성 완료");
  }
}

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return { tasks: [], records: [], templates: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

initDB();

// ─── API 라우트 ─────────────────────────────────────────────

// 전체 데이터 조회
app.get("/api/data", (req, res) => {
  try {
    res.json(readDB());
  } catch (e) {
    res.status(500).json({ error: "데이터 읽기 실패" });
  }
});

// 전체 데이터 덮어쓰기 (동기화용)
app.post("/api/data", (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") return res.status(400).json({ error: "유효하지 않은 데이터" });
    writeDB(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "데이터 저장 실패" });
  }
});

// ── 업무(tasks) ──────────────────────────────────────────────

// 업무 추가
app.post("/api/tasks", (req, res) => {
  try {
    const db = readDB();
    const task = req.body;
    if (!task || !task.id) return res.status(400).json({ error: "유효하지 않은 업무 데이터" });
    db.tasks.push(task);
    writeDB(db);
    res.json({ ok: true, task });
  } catch (e) {
    res.status(500).json({ error: "업무 추가 실패" });
  }
});

// 업무 수정
app.put("/api/tasks/:taskId", (req, res) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.taskId);
    if (idx === -1) return res.status(404).json({ error: "업무를 찾을 수 없습니다" });
    db.tasks[idx] = { ...db.tasks[idx], ...req.body };
    writeDB(db);
    res.json({ ok: true, task: db.tasks[idx] });
  } catch (e) {
    res.status(500).json({ error: "업무 수정 실패" });
  }
});

// 업무 삭제
app.delete("/api/tasks/:taskId", (req, res) => {
  try {
    const db = readDB();
    const before = db.tasks.length;
    db.tasks = db.tasks.filter(t => t.id !== req.params.taskId);
    if (db.tasks.length === before) return res.status(404).json({ error: "업무를 찾을 수 없습니다" });
    writeDB(db);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "업무 삭제 실패" });
  }
});

// 체크리스트 항목 토글
app.put("/api/tasks/:taskId/checklist/:checkId", (req, res) => {
  try {
    const db = readDB();
    const task = db.tasks.find(t => t.id === req.params.taskId);
    if (!task) return res.status(404).json({ error: "업무를 찾을 수 없습니다" });
    const check = task.checklist.find(c => c.id === req.params.checkId);
    if (!check) return res.status(404).json({ error: "체크리스트 항목을 찾을 수 없습니다" });
    Object.assign(check, req.body);
    writeDB(db);
    res.json({ ok: true, check });
  } catch (e) {
    res.status(500).json({ error: "체크리스트 수정 실패" });
  }
});

// ── 기록(records) ────────────────────────────────────────────

app.post("/api/records", (req, res) => {
  try {
    const db = readDB();
    const record = req.body;
    if (!record || !record.id) return res.status(400).json({ error: "유효하지 않은 기록 데이터" });
    db.records.unshift(record);
    writeDB(db);
    res.json({ ok: true, record });
  } catch (e) {
    res.status(500).json({ error: "기록 저장 실패" });
  }
});

// ── 템플릿(templates) ────────────────────────────────────────

app.post("/api/templates", (req, res) => {
  try {
    const db = readDB();
    const tpl = req.body;
    if (!tpl || !tpl.id) return res.status(400).json({ error: "유효하지 않은 템플릿 데이터" });
    db.templates.unshift(tpl);
    writeDB(db);
    res.json({ ok: true, template: tpl });
  } catch (e) {
    res.status(500).json({ error: "템플릿 저장 실패" });
  }
});

// ─── 나머지 요청은 index.html 반환 ──────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🚀 서버 실행 중: http://localhost:${PORT}`);
  console.log(`📂 데이터 파일: ${DB_PATH}\n`);
});
