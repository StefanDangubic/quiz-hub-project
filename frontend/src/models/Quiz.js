export class Quiz {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.description = data.description || '';
    this.categoryId = data.categoryId || 0;
    this.categoryName = data.categoryName || '';
    this.difficultyLevel = data.difficultyLevel || 1;
    this.timeLimit = data.timeLimit || 30;
    this.questionCount = data.questionCount || 0;
    this.createdBy = data.createdBy || 0;
    this.creatorUsername = data.creatorUsername || '';
    this.isActive = data.isActive || true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static fromApiResponse(data) {
    return new Quiz(data);
  }

  getDifficultyText() {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    return levels[this.difficultyLevel] || 'Unknown';
  }

  getDifficultyColor() {
    const colors = { 1: 'green', 2: 'yellow', 3: 'red' };
    return colors[this.difficultyLevel] || 'gray';
  }

  getTimeLimitText() {
    return `${this.timeLimit} minutes`;
  }
}

export class Question {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.quizId = data.quizId || 0;
    this.questionText = data.questionText || '';
    this.questionType = data.questionType || 1;
    this.points = data.points || 1;
    this.orderIndex = data.orderIndex || 0;
    this.answers = (data.answers || []).map(answer => new Answer(answer));
  }

  static fromApiResponse(data) {
    return new Question(data);
  }

  getTypeText() {
    const types = {
      1: 'Single Choice',
      2: 'Multiple Choice', 
      3: 'True/False',
      4: 'Fill in the Blank'
    };
    return types[this.questionType] || 'Unknown';
  }
}

export class Answer {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.questionId = data.questionId || 0;
    this.answerText = data.answerText || '';
    this.isCorrect = data.isCorrect || false;
    this.orderIndex = data.orderIndex || 0;
  }

  static fromApiResponse(data) {
    return new Answer(data);
  }
}
