/**
 * ZYN Bhaiya Study Tracker - Data Module
 * CBSE Class 9 & 10 Chapters + Stages + Video Recommendations
 */

(function () {
  "use strict";

  // ========== STAGES ==========
  const STAGE_SETS = {
    9: ["theory", "ncert", "revision"],
    10: ["theory", "ncert", "exemplar", "pyq", "cbq"]
  };

  const STAGE_LABELS = {
    theory: "Theory / Concepts",
    ncert: "NCERT Questions",
    exemplar: "NCERT Exemplar",
    pyq: "Previous Year Qs",
    cbq: "Competency Qs (CBQ)",
    revision: "Revision"
  };

  const STAGE_ICONS = {
    theory: "📖",
    ncert: "✏️",
    exemplar: "🧠",
    pyq: "📜",
    cbq: "🎯",
    revision: "🔄"
  };

  function getStageKeys(grade) {
    return STAGE_SETS[grade] || STAGE_SETS[10];
  }

  function getStageLabel(key) {
    return STAGE_LABELS[key] || key;
  }

  // ========== CLASS 10 DATA (Rationalised 2025-26) ==========
  const CLASS_10 = [
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      color: "#10b981",
      groups: [{
        id: "science",
        name: null,
        chapters: [
          { id: "ch1", no: 1, name: "Chemical Reactions and Equations" },
          { id: "ch2", no: 2, name: "Acids, Bases and Salts" },
          { id: "ch3", no: 3, name: "Metals and Non-metals" },
          { id: "ch4", no: 4, name: "Carbon and its Compounds" },
          { id: "ch5", no: 5, name: "Life Processes" },
          { id: "ch6", no: 6, name: "Control and Coordination" },
          { id: "ch7", no: 7, name: "How do Organisms Reproduce?" },
          { id: "ch8", no: 8, name: "Heredity" },
          { id: "ch9", no: 9, name: "Light – Reflection and Refraction" },
          { id: "ch10", no: 10, name: "Human Eye and Colourful World" },
          { id: "ch11", no: 11, name: "Electricity" },
          { id: "ch12", no: 12, name: "Magnetic Effects of Electric Current" },
          { id: "ch13", no: 13, name: "Our Environment" }
        ]
      }]
    },
    {
      id: "maths",
      name: "Mathematics",
      icon: "📐",
      color: "#3b82f6",
      groups: [{
        id: "maths",
        name: null,
        chapters: [
          { id: "ch1", no: 1, name: "Real Numbers" },
          { id: "ch2", no: 2, name: "Polynomials" },
          { id: "ch3", no: 3, name: "Pair of Linear Equations in Two Variables" },
          { id: "ch4", no: 4, name: "Quadratic Equations" },
          { id: "ch5", no: 5, name: "Arithmetic Progressions" },
          { id: "ch6", no: 6, name: "Triangles" },
          { id: "ch7", no: 7, name: "Coordinate Geometry" },
          { id: "ch8", no: 8, name: "Introduction to Trigonometry" },
          { id: "ch9", no: 9, name: "Some Applications of Trigonometry" },
          { id: "ch10", no: 10, name: "Circles" },
          { id: "ch11", no: 11, name: "Areas Related to Circles" },
          { id: "ch12", no: 12, name: "Surface Areas and Volumes" },
          { id: "ch13", no: 13, name: "Statistics" },
          { id: "ch14", no: 14, name: "Probability" }
        ]
      }]
    },
    {
      id: "sst",
      name: "Social Science",
      icon: "🌍",
      color: "#f59e0b",
      groups: [
        {
          id: "history",
          name: "History",
          chapters: [
            { id: "his_ch1", no: 1, name: "The Rise of Nationalism in Europe" },
            { id: "his_ch2", no: 2, name: "Nationalism in India" },
            { id: "his_ch3", no: 3, name: "The Making of a Global World" },
            { id: "his_ch4", no: 4, name: "The Age of Industrialisation" },
            { id: "his_ch5", no: 5, name: "Print Culture and the Modern World" }
          ]
        },
        {
          id: "geo",
          name: "Geography",
          chapters: [
            { id: "geo_ch1", no: 1, name: "Resources and Development" },
            { id: "geo_ch2", no: 2, name: "Forest and Wildlife Resources" },
            { id: "geo_ch3", no: 3, name: "Water Resources" },
            { id: "geo_ch4", no: 4, name: "Agriculture" },
            { id: "geo_ch5", no: 5, name: "Minerals and Energy Resources" },
            { id: "geo_ch6", no: 6, name: "Manufacturing Industries" },
            { id: "geo_ch7", no: 7, name: "Lifelines of National Economy" }
          ]
        },
        {
          id: "civics",
          name: "Political Science",
          chapters: [
            { id: "pol_ch1", no: 1, name: "Power Sharing" },
            { id: "pol_ch2", no: 2, name: "Federalism" },
            { id: "pol_ch3", no: 3, name: "Gender, Religion and Caste" },
            { id: "pol_ch4", no: 4, name: "Political Parties" },
            { id: "pol_ch5", no: 5, name: "Outcomes of Democracy" }
          ]
        },
        {
          id: "eco",
          name: "Economics",
          chapters: [
            { id: "eco_ch1", no: 1, name: "Development" },
            { id: "eco_ch2", no: 2, name: "Sectors of the Indian Economy" },
            { id: "eco_ch3", no: 3, name: "Money and Credit" },
            { id: "eco_ch4", no: 4, name: "Globalisation and the Indian Economy" },
            { id: "eco_ch5", no: 5, name: "Consumer Rights" }
          ]
        }
      ]
    }
  ];

  // ========== CLASS 9 DATA (Simplified standard for better usability) ==========
  const CLASS_9 = [
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      color: "#10b981",
      groups: [{
        id: "science",
        name: null,
        chapters: [
          { id: "ch1", no: 1, name: "Matter in Our Surroundings" },
          { id: "ch2", no: 2, name: "Is Matter Around Us Pure?" },
          { id: "ch3", no: 3, name: "Atoms and Molecules" },
          { id: "ch4", no: 4, name: "Structure of the Atom" },
          { id: "ch5", no: 5, name: "The Fundamental Unit of Life" },
          { id: "ch6", no: 6, name: "Tissues" },
          { id: "ch7", no: 7, name: "Motion" },
          { id: "ch8", no: 8, name: "Force and Laws of Motion" },
          { id: "ch9", no: 9, name: "Gravitation" },
          { id: "ch10", no: 10, name: "Work and Energy" },
          { id: "ch11", no: 11, name: "Sound" },
          { id: "ch12", no: 12, name: "Improvement in Food Resources" }
        ]
      }]
    },
    {
      id: "maths",
      name: "Mathematics",
      icon: "📐",
      color: "#3b82f6",
      groups: [{
        id: "maths",
        name: null,
        chapters: [
          { id: "ch1", no: 1, name: "Number Systems" },
          { id: "ch2", no: 2, name: "Polynomials" },
          { id: "ch3", no: 3, name: "Coordinate Geometry" },
          { id: "ch4", no: 4, name: "Linear Equations in Two Variables" },
          { id: "ch5", no: 5, name: "Introduction to Euclid's Geometry" },
          { id: "ch6", no: 6, name: "Lines and Angles" },
          { id: "ch7", no: 7, name: "Triangles" },
          { id: "ch8", no: 8, name: "Quadrilaterals" },
          { id: "ch9", no: 9, name: "Circles" },
          { id: "ch10", no: 10, name: "Heron's Formula" },
          { id: "ch11", no: 11, name: "Surface Areas and Volumes" },
          { id: "ch12", no: 12, name: "Statistics" },
          { id: "ch13", no: 13, name: "Probability" }
        ]
      }]
    },
    {
      id: "sst",
      name: "Social Science",
      icon: "🌍",
      color: "#f59e0b",
      groups: [
        {
          id: "history",
          name: "History",
          chapters: [
            { id: "his_ch1", no: 1, name: "The French Revolution" },
            { id: "his_ch2", no: 2, name: "Socialism in Europe and the Russian Revolution" },
            { id: "his_ch3", no: 3, name: "Nazism and the Rise of Hitler" },
            { id: "his_ch4", no: 4, name: "Forest Society and Colonialism" },
            { id: "his_ch5", no: 5, name: "Pastoralists in the Modern World" }
          ]
        },
        {
          id: "geo",
          name: "Geography",
          chapters: [
            { id: "geo_ch1", no: 1, name: "India – Size and Location" },
            { id: "geo_ch2", no: 2, name: "Physical Features of India" },
            { id: "geo_ch3", no: 3, name: "Drainage" },
            { id: "geo_ch4", no: 4, name: "Climate" },
            { id: "geo_ch5", no: 5, name: "Natural Vegetation and Wildlife" },
            { id: "geo_ch6", no: 6, name: "Population" }
          ]
        },
        {
          id: "civics",
          name: "Political Science",
          chapters: [
            { id: "pol_ch1", no: 1, name: "What is Democracy? Why Democracy?" },
            { id: "pol_ch2", no: 2, name: "Constitutional Design" },
            { id: "pol_ch3", no: 3, name: "Electoral Politics" },
            { id: "pol_ch4", no: 4, name: "Working of Institutions" },
            { id: "pol_ch5", no: 5, name: "Democratic Rights" }
          ]
        },
        {
          id: "eco",
          name: "Economics",
          chapters: [
            { id: "eco_ch1", no: 1, name: "The Story of Village Palampur" },
            { id: "eco_ch2", no: 2, name: "People as Resource" },
            { id: "eco_ch3", no: 3, name: "Poverty as a Challenge" },
            { id: "eco_ch4", no: 4, name: "Food Security in India" }
          ]
        }
      ]
    }
  ];

  // ========== VIDEO RECOMMENDATIONS ==========
  // Generates a good YouTube search URL for short lectures
  function getVideoRecommendation(grade, subjectId, chapterName) {
    const query = encodeURIComponent(
      `CBSE Class ${grade} ${chapterName} short lecture explanation in Hindi`
    );
    return {
      title: `🎥 Short Lecture: ${chapterName}`,
      url: `https://www.youtube.com/results?search_query=${query}`,
      tip: "Yah video dekh lo — 1 short lecture (best match select karo)"
    };
  }

  // Some curated high-quality short videos (real popular ones where known)
  const CURATED_VIDEOS = {
    // Class 10 Science examples
    "10-science-ch1": { title: "Chemical Reactions - Short", url: "https://www.youtube.com/watch?v=8E9N0X6p1uA" },
    "10-science-ch11": { title: "Electricity - Full Concept", url: "https://www.youtube.com/watch?v=5x2m6wQe8qA" },
    // Fallback always uses search
  };

  function getVideoForChapter(grade, subjectId, chapterId, chapterName) {
    const key = `${grade}-${subjectId}-${chapterId}`;
    if (CURATED_VIDEOS[key]) return CURATED_VIDEOS[key];
    return getVideoRecommendation(grade, subjectId, chapterName);
  }

  // ========== MOTIVATIONAL QUOTES ==========
  const QUOTES = [
    { text: "Consistency beats intensity. Thoda thoda har din.", author: "ZYN Bhaiya" },
    { text: "Board exams are not the end, they are just a beginning.", author: "ZYN Bhaiya" },
    { text: "Ek chapter complete = ek step closer to 90%+", author: "ZYN Bhaiya" },
    { text: "Revision is the real secret. Theory padho, questions karo, revise karo.", author: "ZYN Bhaiya" },
    { text: "Aaj ka progress kal ke result ko decide karta hai.", author: "ZYN Bhaiya" },
    { text: "Don't study hard, study smart + track smart.", author: "ZYN Bhaiya" },
    { text: "Har stage complete karna = full confidence on exam day.", author: "ZYN Bhaiya" }
  ];

  function getRandomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  // Expose
  window.ZYN_DATA = {
    STAGE_SETS,
    STAGE_LABELS,
    STAGE_ICONS,
    getStageKeys,
    getStageLabel,
    CLASS_9,
    CLASS_10,
    getVideoForChapter,
    getRandomQuote,
    QUOTES
  };
})();
