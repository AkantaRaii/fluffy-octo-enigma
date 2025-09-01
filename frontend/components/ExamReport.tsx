// components/ExamReport.tsx
"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Question } from "@/components/ResultQuestionCard";

// ---------- Types ----------
export interface Attempt {
  user: { id: number; email: string; first_name: string; last_name: string };
  total_questions: number;
  correct_answers: number;
  obtained_marks: number;
  total_marks: number;
  questions: Question[];
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  cover: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 28, marginBottom: 20, color: "#91a92a", fontWeight: "bold" },
  subheading: { fontSize: 16, marginBottom: 6 },
  section: { marginBottom: 20 },

  // User Info Box
  infoBox: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  infoLabel: { width: 100, fontWeight: "bold", fontSize: 12, color: "#333" },
  infoValue: { fontSize: 12, color: "#555" },

  // Table styles (flexbox)
  table: { marginTop: 10, borderWidth: 1, borderColor: "#ccc" },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
    padding: 4,
  },
  tableCol: { flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 },
  tableCellHeader: { fontSize: 12, fontWeight: "bold" },
  tableCell: { fontSize: 11 },

  correct: { color: "green" },
  wrong: { color: "red" },
  pass: { color: "#91a92a", fontWeight: "bold" },
  fail: { color: "red", fontWeight: "bold" },
});

// ---------- Report Document ----------
const ExamReport = ({ attempt }: { attempt: Attempt }) => {
  const passMark = attempt.total_marks * 0.5; // 50% pass criteria
  const isPass = attempt.obtained_marks >= passMark;

  return (
    <Document>
      {/* Cover Page */}
      <Page style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.heading}>Exam Report</Text>
          <Text style={styles.subheading}>
            Candidate: {attempt.user.first_name} {attempt.user.last_name}
          </Text>
          <Text style={styles.subheading}>Email: {attempt.user.email}</Text>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>

      {/* Summary Page */}
      <Page style={styles.page}>
        <Text style={styles.heading}>Summary</Text>

        {/* User Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>
              {attempt.user.first_name} {attempt.user.last_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{attempt.user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Exam Date:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, isPass ? styles.pass : styles.fail]}>
              {isPass ? "Pass" : "Fail"}
            </Text>
          </View>
        </View>

        {/* Scores Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total Questions</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Correct Answers</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Obtained Marks</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total Marks</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{attempt.total_questions}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { color: "#91a92a" }]}>{attempt.correct_answers}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{attempt.obtained_marks}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{attempt.total_marks}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Questions Page */}
      <Page style={styles.page}>
        <Text style={[styles.heading, { fontSize: 20, marginBottom: 10 }]}>Questions & Answers</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Q#</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Question</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Your Answer</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Correct Answer</Text>
            </View>
          </View>

          {/* Rows */}
          {attempt.questions.map((q, idx) => {
            const userAnswer = q.options.find((o) => o.is_selected)?.text || "—";
            const correctAnswer = q.options.find((o) => o.is_correct)?.text || "—";
            const isCorrect = userAnswer === correctAnswer;

            return (
              <View style={styles.tableRow} key={q.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{idx + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{q.text}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, isCorrect ? styles.correct : styles.wrong]}>
                    {userAnswer}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.correct]}>{correctAnswer}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

// ---------- Exported Download Button ----------
export const DownloadReportButton = ({ attempt }: { attempt: Attempt }) => (
  <PDFDownloadLink
    document={<ExamReport attempt={attempt} />}
    fileName="exam-report.pdf"
  >
    {({ loading }) => (
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
