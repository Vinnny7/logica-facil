'use strict';

const lessons = {
  proposicoes: {
    number: '01',
    title: 'Proposições',
    description: 'Uma proposição é uma afirmação que tem um valor lógico: verdadeiro ou falso.',
    concept: 'Para identificar uma proposição, pergunte se faz sentido classificá-la como verdadeira ou falsa. Uma afirmação falsa também é uma proposição.',
    examples: [
      ['“7 é um número ímpar.”', 'Proposição verdadeira. 7 não é divisível por 2.'],
      ['“2 + 2 = 5.”', 'Proposição falsa. A soma correta é 4.'],
      ['“Você já estudou hoje?”', 'Pergunta. A frase pede uma resposta e não tem valor lógico próprio.'],
      ['“Abra o caderno.”', 'Ordem. A frase pede uma ação e não tem valor lógico próprio.'],
    ],
    questions: [
      { prompt: 'Qual frase é uma proposição?', choices: ['Que horas são?', '9 é um número par.', 'Abra a janela.'], answer: 1, explanation: 'A frase sobre o número 9 é uma afirmação com valor lógico falso. As outras são uma pergunta e uma ordem.' },
      { prompt: 'Qual é o valor lógico de “3 × 4 = 12”?', choices: ['Verdadeiro', 'Falso', 'A frase não tem valor lógico.'], answer: 0, explanation: 'O produto de 3 por 4 é 12, então a afirmação é verdadeira.' },
      { prompt: 'Por que “Feche a porta.” não é uma proposição?', choices: ['Porque é uma afirmação falsa.', 'Porque é uma pergunta.', 'Porque é uma ordem.'], answer: 2, explanation: 'Uma ordem pede uma ação. Ela não recebe valor lógico verdadeiro ou falso.' },
    ],
  },
  conectivos: {
    number: '02',
    title: 'Conectivos',
    description: 'Use E e OU para combinar proposições e NÃO para inverter seu valor lógico.',
    concept: 'Em lógica, representamos afirmações por letras como P e Q. O conectivo escolhido determina como seus valores produzem o resultado.',
    examples: [
      ['E (∧)', 'P ∧ Q só é verdadeiro quando P e Q são verdadeiros.'],
      ['OU (∨)', 'P ∨ Q é verdadeiro quando pelo menos uma proposição é verdadeira. Também vale quando as duas são verdadeiras.'],
      ['NÃO (¬)', '¬P é verdadeiro quando P é falso, e falso quando P é verdadeiro.'],
    ],
    questions: [
      { prompt: 'Se P é verdadeira e Q é falsa, quanto vale P ∧ Q?', choices: ['Verdadeiro', 'Falso', 'Depende da ordem de P e Q.'], answer: 1, explanation: 'O E exige que as duas proposições sejam verdadeiras.' },
      { prompt: 'Se P e Q são verdadeiras, quanto vale P ∨ Q?', choices: ['Falso', 'Depende da ordem de P e Q.', 'Verdadeiro'], answer: 2, explanation: 'O OU inclusivo aceita pelo menos uma proposição verdadeira, inclusive quando as duas são.' },
      { prompt: 'Se P é falsa, quanto vale ¬P?', choices: ['Verdadeiro', 'Falso', 'Depende de Q.'], answer: 0, explanation: 'A negação inverte o valor de P e usa somente essa proposição.' },
    ],
  },
  tabelas: {
    number: '03',
    title: 'Tabelas-verdade',
    description: 'Uma tabela-verdade lista as combinações de valores e o resultado da expressão em cada caso.',
    concept: 'Cada proposição tem dois valores possíveis, V e F. Com duas proposições, há 2 × 2 = 4 combinações. Cada linha usa uma combinação diferente.',
    examples: [
      ['Monte as colunas', 'Escreva P, Q e a expressão cujo valor quer descobrir.'],
      ['Liste as combinações', 'Para duas proposições, use V/V, V/F, F/V e F/F.'],
      ['Calcule o resultado', 'Aplique a regra do conectivo em cada linha. Para P ∧ Q, a última coluna fica V, F, F, F.'],
    ],
    questions: [
      { prompt: 'Quantas linhas de valores há na tabela de P ∨ Q?', choices: ['2', '3', '4'], answer: 2, explanation: 'P pode ter dois valores e Q também. Isso produz 2 × 2 = 4 combinações.' },
      { prompt: 'Em qual linha P ∨ Q é falso?', choices: ['P = F e Q = F', 'P = V e Q = F', 'P = F e Q = V'], answer: 0, explanation: 'O OU só é falso quando as duas proposições são falsas.' },
      { prompt: 'Qual é a coluna de ¬P se as linhas de P são V e F, nessa ordem?', choices: ['V, F', 'F, V', 'V, V'], answer: 1, explanation: 'Negue cada linha separadamente. V vira F e F vira V.' },
    ],
  },
};

const views = {
  home: document.querySelector('#home-view'),
  lesson: document.querySelector('#lesson-view'),
  simulator: document.querySelector('#simulator-view'),
  quiz: document.querySelector('#quiz-view'),
};
const quizContent = document.querySelector('#quiz-content');
const lessonContent = document.querySelector('#lesson-content');
const storageKey = 'logica-facil-progress-v1';
const topics = Object.keys(lessons);
let progress = loadProgress();
let quiz;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved.filter((topic) => topics.includes(topic)) : [];
  } catch {
    return [];
  }
}

function completeModules(completedTopics) {
  progress = [...new Set([...progress, ...completedTopics])];
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // Progress is available for the current page when browser storage is disabled.
  }
  updateProgress();
}

function updateProgress() {
  document.querySelector('#course-progress').textContent = `${progress.length} de ${topics.length} concluídos`;
  for (const topic of topics) {
    const label = progress.includes(topic) ? 'Revisar módulo' : 'Começar módulo';
    document.querySelector(`[data-card="${topic}"]`).firstChild.textContent = `${label} `;
  }
}

function route() {
  const [page = '', topic = ''] = location.hash.slice(1).split('/');
  const lesson = Object.hasOwn(lessons, page);
  const routes = new Map([['simulador', 'simulator'], ['desafio', 'quiz']]);
  const view = lesson ? 'lesson' : (routes.get(page) || 'home');
  const nav = lesson || page === 'conteudos' ? 'conteudos' : page || 'inicio';

  for (const [name, section] of Object.entries(views)) section.hidden = name !== view;
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.dataset.nav === nav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  if (lesson) renderLesson(page);
  if (view === 'simulator') renderSimulator();
  if (view === 'quiz') startQuiz(Object.hasOwn(lessons, topic) ? topic : '');

  if (page === 'conteudos') {
    const heading = document.querySelector('#module-heading');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    document.querySelector('#conteudos').scrollIntoView({ block: 'start' });
  } else {
    if (location.hash) {
      const heading = views[view].querySelector('h1');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }
}

function renderLesson(topic) {
  const lesson = lessons[topic];
  const examples = lesson.examples.map(([title, body]) => `
    <div class="example"><dt>${title}</dt><dd>${body}</dd></div>`).join('');
  const simulatorLink = topic === 'proposicoes' ? '' : '<a class="button outline" href="#simulador">Abrir simulador <span aria-hidden="true">→</span></a>';
  lessonContent.innerHTML = `
    <div class="page-heading">
      <div class="eyebrow"><span class="dot"></span> MÓDULO ${lesson.number}</div>
      <h1>${lesson.title}</h1>
      <p>${lesson.description}</p>
    </div>
    <div class="lesson-grid">
      <div class="panel concept">
        <h2>Como funciona</h2>
        <p>${lesson.concept}</p>
      </div>
      <div class="panel">
        <h2>${topic === 'tabelas' ? 'Passo a passo' : 'Exemplos'}</h2>
        <dl class="examples">${examples}</dl>
      </div>
    </div>
    <div class="page-actions">
      <a class="button primary" href="#desafio/${topic}">Praticar ${lesson.title.toLowerCase()} <span aria-hidden="true">→</span></a>
      ${simulatorLink}
    </div>`;
}

function truthValue(value) {
  return value ? 'V' : 'F';
}

function resultBadge(value) {
  return `<span class="value ${value ? 'true' : 'false'}">${truthValue(value)}</span>`;
}

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}

function renderSimulator() {
  const operator = selectedValue('operator');
  const p = selectedValue('p') === 'true';
  const q = selectedValue('q') === 'true';
  const unary = operator === 'not';
  const operation = Logic.operators[operator];
  document.querySelector('#q-field').hidden = unary;

  const result = operation.calculate(p, q);
  document.querySelector('#simulator-result').innerHTML = `
    <div><span class="expression">${operation.expression}</span><strong>${result ? 'Verdadeiro' : 'Falso'}</strong></div>
    <p>${operation.rule}</p>`;

  const rows = Logic.truthRows(operator).map(({ values, result: rowResult }) => {
    const selected = values[0] === p && (unary || values[1] === q);
    const cells = values.map((value) => `<td>${truthValue(value)}</td>`).join('');
    return `<tr${selected ? ' class="selected-row" aria-current="true"' : ''}>${cells}<td>${resultBadge(rowResult)}${selected ? '<span class="sr-only"> Linha selecionada</span>' : ''}</td></tr>`;
  }).join('');

  document.querySelector('#truth-table').innerHTML = `
    <table aria-label="Tabela-verdade do conectivo ${operation.label}">
      <thead><tr><th scope="col">P</th>${unary ? '' : '<th scope="col">Q</th>'}<th scope="col">${operation.expression}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function startQuiz(topic) {
  const selectedTopics = topic ? [topic] : topics;
  const questions = selectedTopics.flatMap((key) => lessons[key].questions.map((question) => ({ ...question, topic: key })));
  quiz = { topic, selectedTopics, questions, index: 0, score: 0, answered: false, answers: [] };
  document.querySelector('#quiz-heading').textContent = topic ? `Desafio de ${lessons[topic].title.toLowerCase()}` : 'Desafio de lógica';
  document.querySelector('#quiz-description').textContent = `${questions.length} questões com correção e explicação após cada resposta.`;
  renderQuestion();
}

function renderQuestion() {
  const { questions, index } = quiz;
  const question = questions[index];
  const choices = question.choices.map((choice, choiceIndex) => `
    <label class="choice">
      <input type="radio" name="choice" value="${choiceIndex}">
      <span class="choice-letter" aria-hidden="true">${String.fromCharCode(65 + choiceIndex)}</span>
      <span>${choice}</span>
    </label>`).join('');
  quizContent.innerHTML = `
    <div class="panel question-panel">
      <div class="question-status"><span>Questão ${index + 1} de ${questions.length}</span><span>${lessons[question.topic].title}</span></div>
      <progress value="${index + 1}" max="${questions.length}" aria-label="Progresso do desafio"></progress>
      <form id="question-form">
        <fieldset>
          <legend id="question-title" tabindex="-1">${question.prompt}</legend>
          <div class="choices">${choices}</div>
        </fieldset>
        <div id="feedback" role="status" aria-live="polite"></div>
        <div class="page-actions"><button class="button primary" type="submit" disabled>Conferir resposta <span aria-hidden="true">→</span></button></div>
      </form>
    </div>`;
  const form = document.querySelector('#question-form');
  form.addEventListener('change', () => {
    form.querySelector('button').disabled = false;
  });
  form.addEventListener('submit', handleAnswer);
}

function handleAnswer(event) {
  event.preventDefault();
  if (quiz.answered) return;
  const form = event.currentTarget;
  const selection = new FormData(form).get('choice');
  if (selection === null) return;
  const selected = Number(selection);
  const question = quiz.questions[quiz.index];
  const correct = selected === question.answer;
  quiz.answered = true;
  quiz.answers.push({ question, selected, correct });
  quiz.score += Number(correct);

  for (const input of form.querySelectorAll('input')) {
    input.disabled = true;
    if (Number(input.value) === question.answer) input.parentElement.classList.add('correct-choice');
    else if (Number(input.value) === selected) input.parentElement.classList.add('wrong-choice');
  }

  const feedback = document.querySelector('#feedback');
  feedback.className = correct ? 'feedback correct' : 'feedback incorrect';
  feedback.innerHTML = `<strong>${correct ? 'Resposta correta!' : 'Resposta incorreta.'}</strong><p>${question.explanation}</p>`;

  const button = form.querySelector('button');
  button.type = 'button';
  const last = quiz.index + 1 === quiz.questions.length;
  button.innerHTML = `${last ? 'Ver resultado' : 'Próxima questão'} <span aria-hidden="true">→</span>`;
  button.addEventListener('click', () => {
    if (last) {
      completeModules(quiz.selectedTopics);
      renderResults();
      return;
    }
    quiz.index += 1;
    quiz.answered = false;
    renderQuestion();
    document.querySelector('#question-title').focus();
  }, { once: true });
  button.focus();
}

function renderResults() {
  const { score, questions, answers } = quiz;
  const review = answers.map(({ question, selected, correct }, index) => `
    <details class="review">
      <summary><span>${index + 1}. ${question.prompt}</span><strong class="${correct ? 'review-correct' : 'review-incorrect'}">${correct ? 'Correta' : 'Incorreta'}</strong></summary>
      <p><strong>Sua resposta:</strong> ${question.choices[selected]}</p>
      <p><strong>Resposta correta:</strong> ${question.choices[question.answer]}</p>
      <p>${question.explanation}</p>
    </details>`).join('');

  quizContent.innerHTML = `
    <div class="panel result-panel">
      <div class="eyebrow"><span class="dot"></span> DESAFIO CONCLUÍDO</div>
      <h2 id="result-heading" tabindex="-1">${score} de ${questions.length} acertos</h2>
      <p>${score === questions.length ? 'Você acertou todas as questões.' : 'Abra as questões abaixo para revisar suas respostas.'}</p>
      <div class="page-actions">
        <button id="retry-quiz" type="button" class="button primary">Refazer desafio <span aria-hidden="true">⟳</span></button>
        <a href="#conteudos" class="button outline">Voltar aos conteúdos</a>
      </div>
    </div>
    <div class="panel review-panel"><h2>Revisão das respostas</h2>${review}</div>`;

  document.querySelector('#retry-quiz').addEventListener('click', () => {
    startQuiz(quiz.topic);
    document.querySelector('#question-title').focus();
  });
  document.querySelector('#result-heading').focus();
}

document.querySelector('#simulator-view').addEventListener('change', renderSimulator);
document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#main').focus();
});
window.addEventListener('hashchange', route);
updateProgress();
route();
