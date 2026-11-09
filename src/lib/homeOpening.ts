import { homeQuestions, type HomeQuestion } from "./homeQuestions";

export const HOME_OPENING_FAILSAFE_MS = 15_000;

export function getRandomOpeningQuestion(random = Math.random): HomeQuestion {
  return homeQuestions[Math.floor(random() * homeQuestions.length)];
}

export function getOpeningQuestionDuration(question: HomeQuestion) {
  const words = question.text.trim().split(/\s+/).length;
  return Math.min(8000, Math.max(3000, 1000 + words * 260));
}

// Choose a question before paint on every homepage load. Only transient DOM
// state is used; no cookie, storage, or saved visit preference gates the opening.
export const homeOpeningInit = `(() => {
  if (window.location.pathname !== "/") return;
  const root = document.documentElement;
  const questions = ${JSON.stringify(homeQuestions.map(({ id }) => id))};
  const question = questions[Math.floor(Math.random() * questions.length)];
  root.dataset.homeQuestion = String(question);
  root.style.setProperty("--home-question-" + question, "block");
  root.dataset.homeOpening = "intro";
  root.dataset.homeOpeningTimer = String(window.setTimeout(() => {
    if (root.dataset.homeOpening && root.dataset.homeOpening !== "ready") {
      root.dataset.homeOpening = "ready";
      document.dispatchEvent(new Event("slbh-home-opening-skip"));
    }
  }, ${HOME_OPENING_FAILSAFE_MS}));
})();`;
