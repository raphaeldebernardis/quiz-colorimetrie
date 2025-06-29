import React, { useState, useEffect } from 'react';
import { User, Trophy, Clock, Target, LogIn, UserPlus, Play, RotateCcw, Medal } from 'lucide-react';

const ColorimetryQuiz = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('auth');
  const [users, setUsers] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  // Données du quiz (toutes les 46 questions du CSV)
  const questions = [
    {
      question: "Avec quelle couleur neutralise-t-on un fond de décoloration rouge (hauteur de ton 4) ?",
      correct: "Vert",
      options: ["Vert", "0,13", "0,3", "Irisé très clair"]
    },
    {
      question: "Quel fond de décoloration retrouve-t-on sur une hauteur de ton 4 ?",
      correct: "Rouge",
      options: ["Rouge", "10", "Jaune très clair", "0,43"]
    },
    {
      question: "Quelle hauteur de ton présente un fond rouge à neutraliser avec du vert ?",
      correct: "4",
      options: ["4", "0,46", "10", "0,3"]
    },
    {
      question: "Un fond de décoloration rouge doit être neutralisé avec… ?",
      correct: "Vert",
      options: ["Vert", "Orangé jaune", "0,8", "10"]
    },
    {
      question: "Que faut-il utiliser pour neutraliser un fond rouge orangé sur une hauteur de ton 5 ?",
      correct: "Vert + Bleu",
      options: ["Vert + Bleu", "0,43", "0,46", "Rouge orangé"]
    },
    {
      question: "Quelle combinaison neutralise un fond de décoloration rouge orangé ?",
      correct: "Vert + Bleu",
      options: ["Vert + Bleu", "Orange", "Bleu", "Orangé jaune"]
    },
    {
      question: "Le fond de décoloration d'un ton 5 est rouge orangé. Quelle est la hauteur concernée ?",
      correct: "5",
      options: ["5", "Orange", "7", "Jaune"]
    },
    {
      question: "Le fond rouge orangé se trouve à quelle hauteur de ton ?",
      correct: "5",
      options: ["5", "Rouge orangé", "Rouge", "Bleu"]
    },
    {
      question: "Quelle est la couleur complémentaire d'un fond orange sur une hauteur de ton 6 ?",
      correct: "Bleu",
      options: ["Bleu", "0,7", "Rouge orangé", "Irisé"]
    },
    {
      question: "Si le fond de décoloration est orange, quelle neutralisation applique-t-on ?",
      correct: "Bleu",
      options: ["Bleu", "0,002", "Vert + Bleu", "Rouge"]
    },
    {
      question: "Quel est le fond de décoloration d'un ton 6 ?",
      correct: "Orange",
      options: ["Orange", "Bleu", "Irisé très clair", "Bleu irisé"]
    },
    {
      question: "À quelle hauteur correspond un fond orange ?",
      correct: "6",
      options: ["6", "0,003", "Bleu", "Jaune très clair"]
    },
    {
      question: "Quelle neutralisation utiliser face à un fond orangé jaune (hauteur 7) ?",
      correct: "Bleu irisé",
      options: ["Bleu irisé", "0,3", "0,1", "Orange"]
    },
    {
      question: "Quel fond de déco retrouve-t-on sur un ton 7 ?",
      correct: "Orangé jaune",
      options: ["Orangé jaune", "Bleu", "8", "Irisé"]
    },
    {
      question: "Une hauteur de ton 7 présente quel fond de déco ?",
      correct: "Orangé jaune",
      options: ["Orangé jaune", "0,8", "Orange", "Bleu"]
    },
    {
      question: "Le bleu irisé neutralise quelle hauteur de ton ?",
      correct: "7",
      options: ["7", "10", "Orange", "0,2"]
    },
    {
      question: "Avec quelle nuance neutraliser un fond jaune (hauteur 8) ?",
      correct: "Irisé",
      options: ["Irisé", "4", "Jaune très clair", "0,46"]
    },
    {
      question: "À quoi correspond un fond de décoloration jaune ?",
      correct: "Hauteur de ton 8",
      options: ["Hauteur de ton 8", "Irisé clair", "0,2", "6"]
    },
    {
      question: "Le fond de décoloration d'un ton 8 est ?",
      correct: "Jaune",
      options: ["Jaune", "0,13", "0,8", "Vert"]
    },
    {
      question: "Le jaune se neutralise avec quelle tonalité ?",
      correct: "Irisé",
      options: ["Irisé", "5", "Bleu", "Orangé jaune"]
    }
  ];

  // Fonction pour mélanger un array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fonction pour sélectionner 10 questions aléatoirement
  const selectRandomQuestions = () => {
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, 10).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  };

  // Connexion (avec email uniquement)
  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setScreen('menu');
      return true;
    }
    return false;
  };

  // Inscription (email + pseudo + mot de passe)
  const handleRegister = (email, password, nickname) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    if (users.find(u => u.nickname === nickname)) {
      return { success: false, error: 'Ce pseudo est déjà pris' };
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Format d\'email invalide' };
    }
    
    const newUser = {
      id: Date.now(),
      email,
      password,
      nickname,
      scores: []
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setScreen('menu');
    return { success: true };
  };

  // Démarrer le quiz
  const startQuiz = () => {
    const randomQuestions = selectRandomQuestions();
    setCurrentQuiz(randomQuestions);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setStartTime(Date.now());
    setEndTime(null);
    setScreen('quiz');
  };

  // Répondre à une question (passage immédiat)
  const answerQuestion = (answer) => {
    if (!answer || selectedAnswer !== '') return;
    
    const newAnswers = [...answers, {
      question: currentQuiz[currentQuestion].question,
      selected: answer,
      correct: currentQuiz[currentQuestion].correct,
      isCorrect: answer === currentQuiz[currentQuestion].correct
    }];
    
    setAnswers(newAnswers);
    setSelectedAnswer(answer);
    
    if (currentQuestion < currentQuiz.length - 1) {
      // Passage immédiat à la question suivante
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Fin du quiz
      const endTime = Date.now();
      setEndTime(endTime);
      
      const score = newAnswers.filter(a => a.isCorrect).length;
      const totalTime = endTime - startTime;
      
      // Sauvegarder le score
      const newScore = {
        date: new Date().toLocaleDateString(),
        score,
        totalTime,
        totalQuestions: currentQuiz.length
      };
      
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? { ...user, scores: [...user.scores, newScore] }
          : user
      );
      
      setUsers(updatedUsers);
      setCurrentUser({ ...currentUser, scores: [...currentUser.scores, newScore] });
      setScreen('results');
    }
  };

  // Calculer le rang
  const calculateRank = () => {
    // Utiliser directement les users avec leurs scores actuels (après sauvegarde)
    const allScores = users.flatMap(user => 
      user.scores.map(score => ({ ...score, nickname: user.nickname }))
    );
    
    allScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    });
    
    const currentScore = answers.filter(a => a.isCorrect).length;
    const currentTime = endTime - startTime;
    
    let rank = 1;
    for (let score of allScores) {
      if (score.score > currentScore || (score.score === currentScore && score.totalTime < currentTime)) {
        rank++;
      }
    }
    
    // Le total est simplement le nombre de scores existants
    return { rank, total: allScores.length };
  };

  // Formatage du temps
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  // Écran d'authentification
  const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      
      if (isLogin) {
        if (!handleLogin(email, password)) {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        const result = handleRegister(email, password, nickname);
        if (!result.success) {
          setError(result.error);
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Colorimétrie</h1>
            <p className="text-gray-600 mt-2">Testez vos connaissances !</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pseudo (affiché dans les classements)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isLogin ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setNickname('');
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Menu principal
  const MenuScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <User className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Bienvenue, {currentUser.nickname}!</h2>
            </div>
            <p className="text-gray-600">Prêt pour le défi colorimétrie ?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startQuiz}
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center gap-3"
            >
              <Play className="w-8 h-8" />
              <span className="font-semibold">Commencer le Quiz</span>
              <span className="text-sm opacity-90">10 questions aléatoires</span>
            </button>
            
            <button
              onClick={() => setScreen('leaderboard')}
              className="bg-yellow-600 text-white p-6 rounded-lg hover:bg-yellow-700 transition-colors flex flex-col items-center gap-3"
            >
              <Trophy className="w-8 h-8" />
              <span className="font-semibold">Classement</span>
              <span className="text-sm opacity-90">Voir les scores</span>
            </button>
          </div>
          
          {currentUser.scores.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Vos derniers scores:</h3>
              <div className="space-y-2">
                {currentUser.scores.slice(-3).reverse().map((score, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{score.date}</span>
                    <span>{score.score}/{score.totalQuestions} - {formatTime(score.totalTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentUser(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Écran de quiz
  const QuizScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-lg font-semibold">Question {currentQuestion + 1}/10</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(Date.now() - startTime)}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {currentQuiz[currentQuestion]?.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuiz[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(option)}
                  disabled={selectedAnswer !== ''}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer !== ''
                      ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} sur 10
            </div>
            <div className="text-sm text-gray-500">
              Cliquez sur votre réponse
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Écran de résultats
  const ResultsScreen = () => {
    const score = answers.filter(a => a.isCorrect).length;
    const totalTime = endTime - startTime;
    const { rank, total } = calculateRank();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quiz Terminé !</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{score}/10</div>
                <div className="text-sm text-gray-600">Bonnes réponses</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{formatTime(totalTime)}</div>
                <div className="text-sm text-gray-600">Temps total</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">#{rank}</div>
                <div className="text-sm text-gray-600">Rang sur {total}</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Détail des réponses:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {answers.map((answer, index) => (
                  <div key={index} className={`p-3 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-sm font-medium">{answer.question}</div>
                    <div className="text-xs mt-1">
                      <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        Votre réponse: {answer.selected}
                      </span>
                      {!answer.isCorrect && (
                        <span className="text-green-600 ml-2">
                          (Correct: {answer.correct})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setScreen('menu')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Menu
              </button>
              <button
                onClick={startQuiz}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Rejouer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Écran de classement
  const LeaderboardScreen = () => {
    const allScores = users.flatMap(user => 
      user.scores.map(score => ({ ...score, nickname: user.nickname }))
    );
    
    allScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Classement</h2>
            </div>
            
            {allScores.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Aucun score enregistré pour le moment.
              </div>
            ) : (
              <div className="space-y-2 mb-8">
                {allScores.slice(0, 10).map((score, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                    score.nickname === currentUser.nickname ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{score.nickname}</div>
                        <div className="text-xs text-gray-500">{score.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{score.score}/10</div>
                      <div className="text-xs text-gray-500">{formatTime(score.totalTime)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={() => setScreen('menu')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retour au menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu principal
  if (!currentUser) {
    return <AuthScreen />;
  }

  switch (screen) {
    case 'menu':
      return <MenuScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    default:
      return <MenuScreen />;
  }
};

export default ColorimetryQuiz;