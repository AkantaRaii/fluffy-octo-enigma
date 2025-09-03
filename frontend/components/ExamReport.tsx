// components/ExamReport.tsx
"use client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// ---------- Types ----------
export interface Question {
  id: string | number;
  text: string;
  marks: number;
  is_correct: boolean;
  options: {
    id: string | number;
    text: string;
    is_selected: boolean;
    is_correct: boolean;
  }[];
}

export interface Attempt {
  user: { id: number; email: string; first_name: string; last_name: string };
  total_questions: number;
  correct_answers: number;
  obtained_marks: number;
  total_marks: number;
  questions: Question[];
  exam_title?: string;
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: "Helvetica" },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverHeader: {
    alignItems: "center",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: { width: 70, height: 70, marginBottom: 8 },
  heading: { fontSize: 22, color: "#2c3e50", fontWeight: "bold" },
  subheading: { fontSize: 13, marginBottom: 3, color: "#555" },
  sectionHeading: {
    fontSize: 16,
    marginVertical: 8,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  infoItem: { width: "50%", marginBottom: 4 },
  infoLabel: { fontWeight: "bold", color: "#333" },
  badge: {
    padding: 4,
    borderRadius: 3,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
    width: 55,
    fontSize: 10,
  },
  pass: { backgroundColor: "#91a92a" },
  fail: { backgroundColor: "#e74c3c" },
  barContainer: {
    marginTop: 6,
    height: 8,
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#91a92a" },
  questionBlock: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fafafa",
  },
  qText: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  option: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  optionSelected: {
    borderColor: "#84cc16",
    backgroundColor: "#f7fee7",
  },
  optionCorrect: {
    borderColor: "green",
    backgroundColor: "#ecfdf5",
  },
  optionText: { fontSize: 11, color: "#333" },
  wrongText: { color: "red", fontWeight: "bold" },
  correctText: { color: "green", fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 15,
    textAlign: "center",
    width: "100%",
    fontSize: 9,
    color: "#777",
  },
});

// ---------- Report Document ----------
const ExamReport = ({
  attempt,
  examTitle,
}: {
  attempt: Attempt;
  examTitle: string;
}) => {
  const passMark = attempt.total_marks * 0.5;
  const isPass = attempt.obtained_marks >= passMark;
  const percentage = Math.round(
    (attempt.obtained_marks / attempt.total_marks) * 100
  );

  return (
    <Document>
      {/* ---------- Cover Page ---------- */}
      <Page
        style={[
          styles.page,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Image src="/gtnlogo.png" style={styles.logo} />
          <Text style={styles.heading}>{examTitle ?? "Exam Report"}</Text>

          <Text style={styles.subheading}>
            Candidate: {attempt.user.first_name} {attempt.user.last_name}
          </Text>
          <Text style={styles.subheading}>Email: {attempt.user.email}</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </Page>

      {/* ---------- Summary + Q&A Page ---------- */}
      <Page style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 15,
          }}
        >
          <Text style={styles.heading}>{examTitle ?? "Exam Report"}</Text>
          <Image src="/gtnlogo.png" style={styles.logo} />
        </View>
        <Text style={styles.sectionHeading}>Summary</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text>
              {attempt.user.first_name} {attempt.user.last_name}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text>{attempt.user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Exam Date:</Text>
            <Text>
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.badge, isPass ? styles.pass : styles.fail]}>
              {isPass ? "PASS" : "FAIL"}
            </Text>
          </View>
        </View>

        <Text style={styles.infoLabel}>
          Marks: {attempt.obtained_marks} / {attempt.total_marks} ({percentage}
          %)
        </Text>
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.sectionHeading}>Questions & Answers</Text>
        {attempt.questions.map((q, idx) => (
          <View
            key={q.id}
            style={[
              styles.questionBlock,
              ...(q.is_correct ? [] : [{ borderColor: "red" }]),
            ]}
          >
            <Text style={styles.qText}>
              Q{idx + 1}. {q.text} ({q.marks} marks)
            </Text>
            {q.options
              .filter((o) => o.is_selected || o.is_correct)
              .map((opt) => (
                <View
                  key={opt.id}
                  style={[
                    styles.option,
                    ...(opt.is_selected ? [styles.optionSelected] : []),
                    ...(opt.is_correct ? [styles.optionCorrect] : []),
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      ...(opt.is_selected && !opt.is_correct
                        ? [styles.wrongText]
                        : []),
                      ...(opt.is_correct ? [styles.correctText] : []),
                    ]}
                  >
                    {opt.text}
                  </Text>
                </View>
              ))}
          </View>
        ))}

        <Text style={styles.footer}>
          Confidential — Generated by GTN Exam System
        </Text>
      </Page>
    </Document>
  );
};

// ---------- Exported Download Button ----------
export const DownloadReportButton = ({
  attempt,
  examTitle,
}: {
  attempt: Attempt;
  examTitle: string;
}) => (
  <PDFDownloadLink
    document={<ExamReport attempt={attempt} examTitle={examTitle} />}
    fileName={`exam-report-${examTitle ?? "report"}-${
      new Date().toISOString().split("T")[0]
    }.pdf`}
  >
    {({ loading }: { loading: boolean }) => (
      <button
        className="px-4 py-2 bg-theme text-white rounded-lg shadow hover:bg-theme-dark"
        disabled={loading}
      >
        {loading ? "Preparing..." : "Download Report"}
      </button>
    )}
  </PDFDownloadLink>
);

export default ExamReport;
