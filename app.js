// ==========================================
// SUPABASE CLIENT INITIALIZATION & ADMIN ENGINE
// ==========================================
const SUPABASE_URL = "https://ngvlbvhsnfhuivbbrynp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndmxidmhzbmZodWl2YmJyeW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MjM5MjcsImV4cCI6MjEwMDk5OTkyN30.uWhGx8DhA2a-xpe6S3sQ4_8SlpSS7QytNfwXX9EialI";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Publish Chapter directly from the Admin Panel form to Supabase
async function publishChapterToSupabase() {
  const gradeKey = document.getElementById("admin-grade").value;      // 👈 Captures Class selection (class-7, class-8, etc.)
  const subjectKey = document.getElementById("admin-subject").value;  // 👈 Captures Subject selection
  const chapterId = document.getElementById("admin-chapter-id").value.trim();
  const title = document.getElementById("admin-title").value.trim();
  const summary = document.getElementById("admin-summary").value.trim();
  const question = document.getElementById("admin-question").value.trim();
  const solution = document.getElementById("admin-solution").value.trim();

  if (!chapterId || !title || !summary) {
    alert("Please fill in at least Chapter ID, Title, and Summary!");
    return;
  }

  const newChapter = {
    id: chapterId,
    grade_key: gradeKey,
    subject_key: subjectKey,
    title: title,
    summary: summary,
    question: question,
    solution: solution
  };

  const { data, error } = await supabaseClient
    .from('chapters')
    .insert([newChapter]);

  if (error) {
    alert("Error publishing chapter: " + error.message);
  } else {
    alert(`🎉 Chapter "${title}" published live to ${gradeKey.toUpperCase()} successfully!`);
    renderDashboard();
  }
}

// ==========================================
// BULK CHAPTER UPLOADER (JSON)
// ==========================================
async function uploadBulkChaptersJSON() {
  const fileInput = document.getElementById("bulk-file-input");
  
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select a JSON file first!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function(e) {
    try {
      const chaptersData = JSON.parse(e.target.result);

      if (!Array.isArray(chaptersData)) {
        alert("Invalid file format: JSON must contain an array [...] of chapter objects.");
        return;
      }

      // Insert all chapters into Supabase in one batch
      const { data, error } = await supabaseClient
        .from('chapters')
        .insert(chaptersData);

      if (error) {
        console.error("Bulk Upload Error:", error);
        alert("Upload failed: " + error.message);
      } else {
        alert(`🎉 Successfully published ${chaptersData.length} chapters to Supabase live!`);
        fileInput.value = ""; // Clear file input
      }
    } catch (err) {
      alert("Error parsing JSON file: " + err.message);
    }
  };

  reader.readAsText(file);
}
// ==========================================
// ADMIN LOGIN ENGINE
// ==========================================
async function adminLogin() {
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();

  if (!email || !password) {
    alert("Please enter both your Admin email and password!");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("🎉 Logged in as Admin! Publishing controls unlocked.");
    // Hide login box & display chapter form
    document.getElementById("admin-login-box").style.display = "none";
    document.getElementById("admin-form-box").style.display = "block";
  }
}
// Fetch Chapters Dynamically from Supabase
async function fetchChaptersFromSupabase(gradeKey, subjectKey) {
  const { data, error } = await supabaseClient
    .from('chapters')
    .select('*')
    .eq('grade_key', gradeKey)
    .eq('subject_key', subjectKey);

  if (error) {
    console.error("Error fetching chapters from Supabase:", error);
    return [];
  }
  return data || [];
}
// ==========================================
// EXISTING CODE BELOW (conceptDeckData...)
// ==========================================
// ConceptDeck Curriculum Database
const conceptDeckData = {
  "class-7": {
    name: "Class 7",
    subjects: {
      math: {
        title: "Mathematics",
        icon: "📐",
        chapters: [
          { 
            id: "m7-1", 
            title: "Integers & Operations", 
            summary: "Properties of addition, subtraction, multiplication, and division of positive and negative integers.", 
            question: "Evaluate: (-15) × (-4) + (-12) ÷ 3.",
            quiz: [
              { q: "What is the product of two negative integers?", options: ["Negative Integer", "Positive Integer", "Zero", "Undefined"], correct: 1 },
              { q: "Which property states that a + b = b + a?", options: ["Associative", "Commutative", "Distributive", "Closure"], correct: 1 }
            ]
          },
          { 
            id: "m7-2", 
            title: "Fractions and Decimals", 
            summary: "Operations on proper, improper fractions, mixed numbers, and decimal calculations.", 
            question: "Evaluate: 3/4 ÷ 1/2.",
            quiz: [
              { q: "What is 3/4 ÷ 1/2?", options: ["3/8", "3/2", "2/3", "1/4"], correct: 1 },
              { q: "To divide fractions, you multiply by the:", options: ["Numerator", "Reciprocal", "Denominator", "LCM"], correct: 1 }
            ]
          }
        ]
      },
      physics: {
        title: "Physics",
        icon: "⚡",
        chapters: [
          { 
            id: "p7-1", 
            title: "Physical Quantities and Measurement", 
            summary: "Measurement of area, volume, density, and speed with standard units.", 
            question: "Find the density of a block of mass 200g and volume 50 cm³.",
            quiz: [
              { q: "What is the SI unit of density?", options: ["g/cm³", "kg/m³", "kg/cm³", "m³/kg"], correct: 1 },
              { q: "Density is defined as:", options: ["Mass × Volume", "Mass ÷ Volume", "Volume ÷ Mass", "Force × Area"], correct: 1 }
            ]
          },
          {
            id: "p7-2",
            title: "Force and Motion",
            summary: "Types of motion, speed calculations, and effects of friction.",
            question: "A bicycle travels 100 meters in 20 seconds. Calculate its speed.",
            quiz: [
              { q: "What is the SI unit of speed?", options: ["km/h", "m/s", "m/s²", "cm/s"], correct: 1 },
              { q: "A motion that repeats itself at regular intervals is called:", options: ["Translatory", "Periodic", "Rotational", "Random"], correct: 1 }
            ]
          }
        ]
      },
      chemistry: {
        title: "Chemistry",
        icon: "🧪",
        chapters: [
          { 
            id: "c7-1", 
            title: "Matter and Its Composition", 
            summary: "States of matter, molecular arrangements, and interconversion of states.", 
            question: "Explain why gases are highly compressible compared to solids.",
            quiz: [
              { q: "The process of a solid changing directly into a gas is called:", options: ["Evaporation", "Condensation", "Sublimation", "Melting"], correct: 2 },
              { q: "In which state of matter are intermolecular forces the strongest?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: 0 }
            ]
          },
          {
            id: "c7-2",
            title: "Elements, Compounds and Mixtures",
            summary: "Symbols, formulas, homogenous/heterogenous mixtures, and separation techniques.",
            question: "Name the method used to separate iron filings from sand.",
            quiz: [
              { q: "Pure water is an example of a:", options: ["Element", "Compound", "Mixture", "Solution"], correct: 1 },
              { q: "Which technique is used to separate insoluble solids from liquids?", options: ["Evaporation", "Filtration", "Distillation", "Sublimation"], correct: 1 }
            ]
          }
        ]
      },
      biology: {
        title: "Biology",
        icon: "🧬",
        chapters: [
          { 
            id: "b7-1", 
            title: "Plant and Animal Tissues", 
            summary: "Meristematic vs permanent tissues in plants; epithelial, connective, muscular, and nerve tissues in animals.", 
            question: "Differentiate between xylem and phloem tissues.",
            quiz: [
              { q: "Which plant tissue conducts water and minerals from roots to leaves?", options: ["Phloem", "Xylem", "Parenchyma", "Collenchyma"], correct: 1 },
              { q: "Which tissue connects muscles to bones?", options: ["Ligament", "Tendon", "Cartilage", "Epithelium"], correct: 1 }
            ]
          }
        ]
      },
      history: {
        title: "History & Civics",
        icon: "🏛️",
        chapters: [
          { 
            id: "h7-1", 
            title: "The Delhi Sultanate", 
            summary: "Rise of the Slave, Khilji, Tughlaq, Sayyid, and Lodi dynasties in medieval India.", 
            question: "Who was the first female ruler of the Delhi Sultanate?",
            quiz: [
              { q: "Who founded the Slave Dynasty in India?", options: ["Qutb-ud-din Aibak", "Iltutmish", "Balban", "Alauddin Khilji"], correct: 0 },
              { q: "Who was the first and only Muslim woman ruler of Delhi?", options: ["Razia Sultana", "Nur Jahan", "Chand Bibi", "Mumtaz Mahal"], correct: 0 }
            ]
          },
          {
            id: "h7-2",
            title: "The Mughal Empire",
            summary: "Rule of Babur, Humayun, Akbar, Jahangir, Shah Jahan, and Aurangzeb.",
            question: "In which year was the First Battle of Panipat fought?",
            quiz: [
              { q: "Who established the Mughal Empire in India?", options: ["Akbar", "Babur", "Humayun", "Shah Jahan"], correct: 1 },
              { q: "The First Battle of Panipat took place in:", options: ["1526", "1556", "1761", "1576"], correct: 0 }
            ]
          }
        ]
      },
      geography: {
        title: "Geography",
        icon: "🌍",
        chapters: [
          { 
            id: "g7-1", 
            title: "Weathering and Soil Formation", 
            summary: "Processes of physical and chemical weathering, soil horizons, and soil conservation.", 
            question: "Differentiate between physical and chemical weathering.",
            quiz: [
              { q: "The topmost layer of soil rich in organic humus is:", options: ["Topsoil (Horizon A)", "Subsoil (Horizon B)", "Bedrock", "Substratum"], correct: 0 },
              { q: "Rusting of iron present in rocks is an example of:", options: ["Physical weathering", "Chemical weathering", "Biological erosion", "Deposition"], correct: 1 }
            ]
          },
          {
            id: "g7-2",
            title: "Weather and Climate",
            summary: "Elements of weather, atmospheric temperature, pressure, winds, and humidity.",
            question: "Which instrument is used to measure atmospheric pressure?",
            quiz: [
              { q: "Atmospheric pressure is measured using a:", options: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"], correct: 1 },
              { q: "Rainfall is measured using a:", options: ["Wind Vane", "Rain Gauge", "Barometer", "Seismograph"], correct: 1 }
            ]
          }
        ]
      },
      computers: {
        title: "Computer Studies",
        icon: "💻",
        chapters: [
          { 
            id: "cs7-1", 
            title: "Computer Virus & Cyber Security", 
            summary: "Malware types (Viruses, Trojans, Worms, Spyware), antivirus software, and online safety practices.", 
            question: "What is the primary difference between a computer virus and a worm?",
            quiz: [
              { q: "Malicious software designed to harm or compromise a system is called:", options: ["Hardware", "Malware", "Firmware", "Shareware"], correct: 1 },
              { q: "Which tool actively monitors network traffic to block unauthorized access?", options: ["Firewall", "Spreadsheet", "Database", "Compiler"], correct: 0 }
            ]
          },
          {
            id: "cs7-2",
            title: "Introduction to HTML",
            summary: "Basic structure of HTML documents, tags, elements, attributes, and page styling.",
            question: "Which tag is used to create the largest heading in HTML?",
            quiz: [
              { q: "HTML stands for:", options: ["Hypertext Markup Language", "High Text Machine Language", "Hyperlink Text Mode Language", "Home Tool Markup Language"], correct: 0 },
              { q: "Which tag is used to display a paragraph?", options: ["<p>", "<para>", "<paragraph>", "<text>"], correct: 0 }
            ]
          }
        ]
      }
    }
  },
  "class-8": {
    name: "Class 8",
    subjects: {
      math: {
        title: "Mathematics",
        icon: "📐",
        chapters: [
          { 
            id: "m8-1", 
            title: "Rational Numbers", 
            summary: "Properties of rational numbers, closure, commutativity, associativity, and representation on a number line.", 
            question: "Find three rational numbers between -2/3 and 1/4.",
            quiz: [
              { q: "Which of the following is a positive rational number?", options: ["-3/5", "4/7", "-2/3", "-5/8"], correct: 1 },
              { q: "What is the additive inverse of -5/9?", options: ["-9/5", "5/9", "9/5", "-5/9"], correct: 1 }
            ]
          },
          {
            id: "m8-2",
            title: "Exponents and Powers",
            summary: "Laws of exponents, negative exponents, and standard scientific notation.",
            question: "Simplify: (2³ × 2⁻⁵) ÷ 2⁻².",
            quiz: [
              { q: "Any non-zero number raised to the power 0 equals:", options: ["0", "1", "The number itself", "Infinity"], correct: 1 },
              { q: "What is the value of 5⁻²?", options: ["-10", "-25", "1/25", "1/10"], correct: 2 }
            ]
          }
        ]
      },
      physics: {
        title: "Physics",
        icon: "⚡",
        chapters: [
          { 
            id: "p8-1", 
            title: "Matter & Kinetic Theory", 
            summary: "Kinetic molecular theory of matter, states of matter, and change of state.", 
            question: "Explain the process of vaporization in terms of kinetic theory.",
            quiz: [
              { q: "As temperature increases, the kinetic energy of molecules:", options: ["Decreases", "Increases", "Remains constant", "Becomes zero"], correct: 1 },
              { q: "The process of a gas turning into a liquid is called:", options: ["Freezing", "Condensation", "Sublimation", "Evaporation"], correct: 1 }
            ]
          },
          {
            id: "p8-2",
            title: "Physical Quantities and Measurement",
            summary: "Measurement of density of irregular solids, fluids, and relative density.",
            question: "What is relative density and what is its unit?",
            quiz: [
              { q: "Relative density has which unit?", options: ["g/cm³", "kg/m³", "No unit", "N/m²"], correct: 2 },
              { q: "If relative density of a substance is > 1, it will:", options: ["Float on water", "Sink in water", "Evaporate", "Dissolve"], correct: 1 }
            ]
          }
        ]
      },
      chemistry: {
        title: "Chemistry",
        icon: "🧪",
        chapters: [
          { 
            id: "c8-1", 
            title: "Atomic Structure", 
            summary: "Subatomic particles (protons, neutrons, electrons), atomic number, mass number, and valency.", 
            question: "What determines the atomic number of an element?",
            quiz: [
              { q: "Which subatomic particle carries a negative charge?", options: ["Proton", "Neutron", "Electron", "Nucleus"], correct: 2 },
              { q: "The total number of protons and neutrons in an atom is called its:", options: ["Atomic number", "Mass number", "Valency", "Isotope"], correct: 1 }
            ]
          }
        ]
      },
      biology: {
        title: "Biology",
        icon: "🧬",
        chapters: [
          { 
            id: "b8-1", 
            title: "Transport in Plants", 
            summary: "Transpiration, absorption of water by roots, xylem and phloem translocation.", 
            question: "Describe the role of stomata in transpiration.",
            quiz: [
              { q: "Evaporation of water from plant leaves is known as:", options: ["Respiration", "Photosynthesis", "Transpiration", "Guttation"], correct: 2 },
              { q: "Which tissue carries prepared food from leaves to other parts of the plant?", options: ["Xylem", "Phloem", "Cambium", "Cortex"], correct: 1 }
            ]
          }
        ]
      },
      history: {
        title: "History & Civics",
        icon: "🏛️",
        chapters: [
          { 
            id: "h8-1", 
            title: "The Industrial Revolution", 
            summary: "Causes, key inventions, and social/economic impacts of the Industrial Revolution in Britain.", 
            question: "Name two major inventions that transformed the textile industry during the Industrial Revolution.",
            quiz: [
              { q: "Where did the Industrial Revolution first begin?", options: ["France", "Germany", "Britain", "USA"], correct: 2 },
              { q: "Who invented the steam engine?", options: ["James Watt", "George Stephenson", "Eli Whitney", "Henry Ford"], correct: 0 }
            ]
          }
        ]
      },
      geography: {
        title: "Geography",
        icon: "🌍",
        chapters: [
          { 
            id: "g8-1", 
            title: "Representation of Geographical Features", 
            summary: "Topographical maps, symbols, contours, scale, and measuring distances.", 
            question: "What do closely spaced contour lines indicate on a topographical map?",
            quiz: [
              { q: "Contour lines joining places of equal height are measured from:", options: ["Ground level", "Mean Sea Level", "Peak of mountain", "River bed"], correct: 1 },
              { q: "Closely spaced contours indicate a:", options: ["Gentle slope", "Steep slope", "Flat plain", "Valley"], correct: 1 }
            ]
          }
        ]
      },
      computers: {
        title: "Computer Studies",
        icon: "💻",
        chapters: [
          { 
            id: "cs8-1", 
            title: "Operating System & Graphical User Interface", 
            summary: "Functions of an OS, CLI vs GUI, file management, and device drivers.", 
            question: "Distinguish between CLI and GUI with examples.",
            quiz: [
              { q: "Which software acts as an interface between the user and computer hardware?", options: ["Application Software", "Operating System", "Utility Program", "Compiler"], correct: 1 },
              { q: "MS-DOS is an example of a:", options: ["GUI", "CLI (Command Line Interface)", "Web Browser", "Database"], correct: 1 }
            ]
          }
        ]
      }
    }
  },
  "class-9": {
    name: "Class 9",
    subjects: {
      physics: {
        title: "Physics",
        icon: "⚡",
        chapters: [
          { id: "p9-1", title: "Measurements and Experimentation", summary: "Standard units, least count, vernier callipers, and screw gauge calculations.", question: "What is the least count of a Vernier Callipers if 10 VSD equals 9 MSD, and 1 MSD = 1 mm?" },
          { 
            id: "p9-2", 
            title: "Motion in One Dimension", 
            summary: "Distance, displacement, speed, velocity, acceleration, and graphical equations of motion.", 
            question: "A car accelerates uniformly from 18 km/h to 54 km/h in 5 seconds. Find its acceleration.",
            quiz: [
              { q: "Which of the following is a vector quantity?", options: ["Distance", "Speed", "Displacement", "Mass"], correct: 2 },
              { q: "What is the SI unit of acceleration?", options: ["m/s", "m/s²", "km/h", "m² s"], correct: 1 },
              { q: "The slope of a displacement-time graph represents:", options: ["Acceleration", "Velocity", "Distance", "Force"], correct: 1 }
            ]
          }
        ]
      }
    }
  },
    "class-10": {
    name: "Class 10",
    subjects: {
      mathematics: {
        title: "Mathematics",
        icon: "📐",
        chapters: [
          { 
            id: "m10-1", 
            title: "Commercial Mathematics (GST & Banking)", 
            summary: "Computation of GST on goods and services, recurring deposit accounts, maturity value, and interest calculations.", 
            question: "A man deposits Rs 1000 per month in a recurring deposit account for 2 years at 6% p.a. simple interest. Find the maturity value.",
            quiz: [
              { q: "GST stands for:", options: ["Goods and Services Tax", "General Sales Tax", "Government State Tax", "Global Service Tariff"], correct: 0 },
              { q: "In a recurring deposit account, interest is calculated on:", options: ["Monthly principal", "Total yearly amount", "Maturity amount", "Principal at the end of the year"], correct: 0 }
            ]
          },
          { 
            id: "m10-2", 
            title: "Quadratic Equations", 
            summary: "Solving quadratic equations by factorization, completing the square, and using the quadratic formula (Sridharacharya method).", 
            question: "Find the roots of the equation: 2x² - 5x + 3 = 0.",
            quiz: [
              { q: "The discriminant of a quadratic equation ax² + bx + c = 0 is given by:", options: ["b² - 4ac", "b² + 4ac", "4ab - c²", "a² - 4bc"], correct: 0 },
              { q: "If the discriminant is less than zero, the roots are:", options: ["Real and equal", "Real and distinct", "Imaginary / Unreal", "Undefined"], correct: 2 }
            ]
          }
        ]
      },
      physics: {
        title: "Physics",
        icon: "⚡",
        chapters: [
          { 
            id: "p10-1", 
            title: "Force, Work, Power and Energy", 
            summary: "Moments of force, equilibrium, centre of gravity, work-energy theorem, and conservation of energy.", 
            question: "Calculate the work done when a force of 20N displaces a body by 5m in the direction of force.",
            quiz: [
              { q: "The turning effect of a force about a pivot is called:", options: ["Moment of force", "Momentum", "Pressure", "Thrust"], correct: 0 },
              { q: "What is the SI unit of work?", options: ["Watt", "Newton", "Joule", "Pascal"], correct: 1 }
            ]
          },
          { 
            id: "p10-2", 
            title: "Light: Refraction through Lenses", 
            summary: "Refraction laws, refractive index, lens formulas, magnification, and ray diagrams.", 
            question: "Find the focal length of a convex lens if an object placed at 20cm produces a real image of the same size.",
            quiz: [
              { q: "Power of a concave lens is always:", options: ["Positive", "Negative", "Zero", "Infinite"], correct: 1 },
              { q: "Which lens is used to correct myopia (nearsightedness)?", options: ["Convex lens", "Concave lens", "Cylindrical lens", "Plane glass"], correct: 1 }
            ]
          }
        ]
      },
      chemistry: {
        title: "Chemistry",
        icon: "🧪",
        chapters: [
          { 
            id: "c10-1", 
            title: "Periodic Table & Periodic Properties", 
            summary: "Modern periodic table, periods and groups, trends in valency, atomic size, metallic character, and electron affinity.", 
            question: "Name the element in Period 3 with the highest electronegativity.",
            quiz: [
              { q: "Across a period from left to right, atomic size generally:", options: ["Increases", "Decreases", "Remains constant", "Doubles"], correct: 1 },
              { q: "Elements in Group 17 are known as:", options: ["Alkali metals", "Halogens", "Noble gases", "Alkaline earth metals"], correct: 1 }
            ]
          }
        ]
      },
      biology: {
        title: "Biology",
        icon: "🧬",
        chapters: [
          { 
            id: "b10-1", 
            title: "Cell Cycle and Cell Division", 
            summary: "Structure of chromosomes, mitosis, meiosis, and their significance in growth, repair, and reproduction.", 
            question: "What is the resting phase between two successive cell divisions called?",
            quiz: [
              { q: "Mitosis results in the production of:", options: ["Two genetically identical daughter cells", "Four haploid cells", "Genetically diverse gametes", "Anucleated cells"], correct: 0 },
              { q: "Crossing over takes place during which phase of meiosis?", options: ["Prophase I", "Metaphase II", "Anaphase I", "Telophase II"], correct: 0 }
            ]
          }
        ]
      }
    }
  }
};

// Scalable ICSE Question Bank organized by Class and Subject
const arenaQuestionBank = {
  "class-7": {
    title: "Class 7",
    icon: "📚",
    subjects: {
      math: {
        title: "Mathematics",
        icon: "📐",
        levels: {
          easy: [
            { q: "What is (-5) × (-6)?", options: ["-30", "30", "11", "-11"], correct: 1 },
            { q: "A triangle with 3 equal sides is:", options: ["Isosceles", "Scalene", "Equilateral", "Right-angled"], correct: 2 }
          ],
          medium: [
            { q: "Solve for x: 2x + 5 = 15", options: ["x = 10", "x = 5", "x = 8", "x = 2"], correct: 1 }
          ],
          hard: [
            { q: "Find the perimeter of a rectangle with length 8cm and breadth 5cm.", options: ["26 cm", "40 cm", "13 cm", "30 cm"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Evaluate: 3/4 + 2/5", options: ["23/20", "5/9", "6/20", "1/2"], correct: 0 }
        ]
      },
      physics: {
        title: "Physics",
        icon: "⚡",
        levels: {
          easy: [
            { q: "What is the SI unit of density?", options: ["g/cm³", "kg/m³", "g/m³", "kg/cm³"], correct: 1 }
          ],
          medium: [
            { q: "Calculate speed if distance = 100m and time = 20s.", options: ["5 m/s", "20 m/s", "2000 m/s", "0.2 m/s"], correct: 0 }
          ],
          hard: [
            { q: "Density = 8 g/cm³, Volume = 25 cm³. Find Mass.", options: ["200 g", "3.125 g", "0.32 g", "100 g"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "A motion that repeats itself at regular intervals is:", options: ["Periodic motion", "Translatory motion", "Random motion", "Circular motion"], correct: 0 }
        ]
      },
      history: {
        title: "History & Civics",
        icon: "🏛️",
        levels: {
          easy: [
            { q: "Who was the founder of the Slave Dynasty?", options: ["Qutb-ud-din Aibak", "Iltutmish", "Balban", "Akbar"], correct: 0 }
          ],
          medium: [
            { q: "In which year was the First Battle of Panipat fought?", options: ["1526", "1556", "1761", "1576"], correct: 0 }
          ],
          hard: [
            { q: "Which Sultan introduced market regulation and price control systems?", options: ["Alauddin Khilji", "Muhammad bin Tughlaq", "Balban", "Firoz Shah Tughlaq"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 7 History Mock: Who built the Qutb Minar's base?", options: ["Qutb-ud-din Aibak", "Iltutmish", "Firoz Shah", "Razia"], correct: 0 }
        ]
      },
      geography: {
        title: "Geography",
        icon: "🌍",
        levels: {
          easy: [
            { q: "Which instrument measures atmospheric pressure?", options: ["Barometer", "Thermometer", "Hygrometer", "Anemometer"], correct: 0 }
          ],
          medium: [
            { q: "The process of rock decay due to oxidation is:", options: ["Chemical weathering", "Physical weathering", "Erosion", "Faulting"], correct: 0 }
          ],
          hard: [
            { q: "Which layer of the atmosphere contains the ozone layer?", options: ["Stratosphere", "Troposphere", "Mesosphere", "Exosphere"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 7 Geography Mock: What is the S.I. unit for measuring atmospheric pressure?", options: ["Pascal (Pa)", "Newton", "Joule", "Degree Celsius"], correct: 0 }
        ]
      },
      computers: {
        title: "Computer Studies",
        icon: "💻",
        levels: {
          easy: [
            { q: "What does HTML stand for?", options: ["Hypertext Markup Language", "High Tech Machine Language", "Hyperlink Text Mode Language", "Home Tool Markup Language"], correct: 0 }
          ],
          medium: [
            { q: "Which of the following is considered malware?", options: ["Trojan Horse", "Antivirus", "Linux", "RAM"], correct: 0 }
          ],
          hard: [
            { q: "Which HTML tag is used to embed an image?", options: ["<img>", "<image>", "<picture>", "<src>"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 7 Computer Mock: Which software acts as a security barrier between a private network and the internet?", options: ["Firewall", "Router", "Browser", "Word Processor"], correct: 0 }
        ]
      }
    }
  },
  "class-8": {
    title: "Class 8",
    icon: "🎓",
    subjects: {
      math: {
        title: "Mathematics",
        icon: "📐",
        levels: {
          easy: [
            { q: "Which of the following is a positive rational number?", options: ["-3/5", "4/7", "-2/-3", "Both b and c"], correct: 3 },
            { q: "What is the additive inverse of -5/9?", options: ["-9/5", "5/9", "9/5", "-5/9"], correct: 1 }
          ],
          medium: [
            { q: "Find the product of (-4/5) and (15/16).", options: ["-3/4", "3/4", "-4/5", "1"], correct: 0 }
          ],
          hard: [
            { q: "Find three rational numbers between -2 and 0.", options: ["-1, -1/2, -3/4", "1, 2, 3", "0, 1, 2", "None"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 Math Mock: Verify closure property for addition of rational numbers on -2/3 and 1/4.", options: ["Result is a rational number", "Result is an integer", "Result is irrational", "Undefined"], correct: 0 }
        ]
      },
      physics: {
        title: "Physics",
        icon: "⚡",
        levels: {
          easy: [
            { q: "As temperature increases, kinetic energy of molecules:", options: ["Increases", "Decreases", "Stays constant", "Becomes zero"], correct: 0 }
          ],
          medium: [
            { q: "What is the unit of relative density?", options: ["kg/m³", "g/cm³", "No unit", "Pascal"], correct: 2 }
          ],
          hard: [
            { q: "A body of mass 500g has volume 250 cm³. Its density is:", options: ["2 g/cm³", "0.5 g/cm³", "125 g/cm³", "1000 g/cm³"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 Physics Mock: The process of a liquid changing to gas at a fixed temperature is:", options: ["Boiling", "Evaporation", "Sublimation", "Condensation"], correct: 0 }
        ]
      },
      chemistry: {
        title: "Chemistry",
        icon: "🧪",
        levels: {
          easy: [
            { q: "Which particle has a negative charge?", options: ["Proton", "Electron", "Neutron", "Nucleus"], correct: 1 }
          ],
          medium: [
            { q: "Atomic number is equal to the number of:", options: ["Protons", "Neutrons", "Protons + Neutrons", "Valency electrons"], correct: 0 }
          ],
          hard: [
            { q: "An atom has 11 protons and 12 neutrons. Its mass number is:", options: ["11", "12", "23", "1"], correct: 2 }
          ]
        },
        boardMock: [
          { q: "Class 8 Chemistry Mock: What is the maximum number of electrons in the K shell?", options: ["2", "8", "18", "32"], correct: 0 }
        ]
      },
      biology: {
        title: "Biology",
        icon: "🧬",
        levels: {
          easy: [
            { q: "Loss of water vapor from leaves is:", options: ["Transpiration", "Respiration", "Osmosis", "Diffusion"], correct: 0 }
          ],
          medium: [
            { q: "Transport of food in plants takes place through:", options: ["Xylem", "Phloem", "Stomata", "Cuticle"], correct: 1 }
          ],
          hard: [
            { q: "Unicellular root hairs absorb water by the process of:", options: ["Osmosis", "Transpiration", "Active transport", "Guttation"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 Biology Mock: Which mineral is essential for chlorophyll synthesis?", options: ["Magnesium", "Iron", "Calcium", "Potassium"], correct: 0 }
        ]
      },
      history: {
        title: "History & Civics",
        icon: "🏛️",
        levels: {
          easy: [
            { q: "Industrial Revolution first began in:", options: ["Britain", "France", "Germany", "USA"], correct: 0 }
          ],
          medium: [
            { q: "Who invented the steam engine?", options: ["James Watt", "Eli Whitney", "Stephenson", "Newton"], correct: 0 }
          ],
          hard: [
            { q: "The movement demanding votes for women in Britain was called:", options: ["Suffragette movement", "Chartist movement", "Luddite movement", "Reform Act"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 History Mock: Who was the Governor-General during the Revolt of 1857?", options: ["Lord Canning", "Lord Dalhousie", "Lord Ripon", "Lord Curzon"], correct: 0 }
        ]
      },
      geography: {
        title: "Geography",
        icon: "🌍",
        levels: {
          easy: [
            { q: "Contour lines join places of equal:", options: ["Height", "Temperature", "Pressure", "Rainfall"], correct: 0 }
          ],
          medium: [
            { q: "Closely spaced contours indicate:", options: ["Steep slope", "Gentle slope", "Plain", "Plateau"], correct: 0 }
          ],
          hard: [
            { q: "A feature represented by V-shaped contours pointing upstream is a:", options: ["River valley", "Ridge", "Spur", "Cliff"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 Geography Mock: Standard scale used for topomaps in India is:", options: ["1:50,000", "1:1,000", "1:100", "1:10,000"], correct: 0 }
        ]
      },
      computers: {
        title: "Computer Studies",
        icon: "💻",
        levels: {
          easy: [
            { q: "Which software acts as an interface between user and hardware?", options: ["Operating System", "Compiler", "Browser", "Antivirus"], correct: 0 }
          ],
          medium: [
            { q: "MS-DOS is an example of:", options: ["CLI", "GUI", "Mobile OS", "Cloud OS"], correct: 0 }
          ],
          hard: [
            { q: "Which memory management technique divides memory into fixed-size blocks?", options: ["Paging", "Segmentation", "Fragmentation", "Caching"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Class 8 Computer Mock: What is the main function of an Operating System?", options: ["Resource management", "Word processing", "Web browsing", "Graphic design"], correct: 0 }
        ]
      }
    }
  },
  "class-9": {
    title: "Class 9",
    icon: "🚀",
    subjects: {
      physics: {
        title: "Physics",
        icon: "⚡",
        levels: {
          easy: [
            { q: "What is the standard SI unit of Force?", options: ["Watt", "Newton", "Joule", "Pascal"], correct: 1 },
            { q: "The path along which a body moves is called its:", options: ["Trajectory", "Velocity", "Acceleration", "Scalar"], correct: 0 }
          ],
          medium: [
            { q: "Calculate the kinetic energy of a 4 kg mass moving at 3 m/s.", options: ["12 J", "18 J", "24 J", "36 J"], correct: 1 },
            { q: "What is the least count of a Vernier Callipers where 1 MSD = 1 mm and 10 VSD = 9 MSD?", options: ["0.1 mm", "0.01 mm", "1 mm", "0.5 mm"], correct: 0 }
          ],
          hard: [
            { q: "A stone is dropped from a tower 45m high. Find its velocity when it hits the ground (g = 10 m/s²).", options: ["20 m/s", "30 m/s", "40 m/s", "50 m/s"], correct: 1 }
          ]
        },
        boardMock: [
          { q: "Board Mock: Which physical quantity remains constant during uniform circular motion?", options: ["Velocity", "Speed", "Acceleration", "Displacement"], correct: 1 },
          { q: "Board Mock: The correct relationship between focal length (f) and radius of curvature (R) is:", options: ["f = R", "f = 2R", "R = 2f", "f = R/4"], correct: 2 }
        ]
      },
      mathematics: {
        title: "Mathematics",
        icon: "📐",
        levels: {
          easy: [
            { q: "Which of the following numbers is a rational number?", options: ["√2", "π", "3/4", "√3"], correct: 2 }
          ],
          medium: [
            { q: "Find the compound interest on Rs 5000 at 10% per annum for 1 year compounded annually.", options: ["Rs 500", "Rs 550", "Rs 450", "Rs 600"], correct: 0 }
          ],
          hard: [
            { q: "Rationalize the denominator of: 2 / (√3 - √2)", options: ["2(√3 + √2)", "√3 - √2", "√3 + √2", "2(√3 - √2)"], correct: 0 }
          ]
        },
        boardMock: [
          { q: "Board Mock: If the price of an article increases by 25%, by what percentage must consumption be reduced?", options: ["15%", "20%", "25%", "30%"], correct: 1 }
        ]
      }
    }
  },
    "class-10": {
    title: "Class 10",
    icon: "📜",
    subjects: {
      physics: {
        title: "Physics",
        icon: "⚡",
        levels: {
          easy: [
            { q: "What is the condition for a body to be in translational equilibrium?", options: ["Sum of forces = 0", "Sum of torques = 0", "Velocity = 0", "Mass = 0"], correct: 0 },
            { q: "The angle of deviation in a prism depends on:", options: ["Angle of incidence", "Color of light", "Material of prism", "All of the above"], correct: 3 }
          ],
          medium: [
            { q: "A force of 10N acts at a perpendicular distance of 50cm from a pivot. Calculate the moment of force.", options: ["5 Nm", "50 Nm", "0.5 Nm", "500 Nm"], correct: 0 }
          ],
          hard: [
            { q: "An electric bulb is rated 220V, 100W. Calculate the resistance of its filament.", options: ["220 ohms", "484 ohms", "48.4 ohms", "100 ohms"], correct: 1 }
          ]
        },
        boardMock: [
          { q: "ICSE Board Mock: Which of the following radiations has the highest frequency?", options: ["Infrared waves", "Ultraviolet rays", "X-rays", "Microwaves"], correct: 2 },
          { q: "ICSE Board Mock: A block and tackle system has a velocity ratio of 4. If its efficiency is 80%, find its mechanical advantage.", options: ["3.2", "4", "5", "3.0"], correct: 0 }
        ]
      },
      mathematics: {
        title: "Mathematics",
        icon: "📐",
        levels: {
          easy: [
            { q: "If the roots of a quadratic equation are real and equal, the discriminant is:", options: ["Greater than zero", "Equal to zero", "Less than zero", "Undefined"], correct: 1 }
          ],
          medium: [
            { q: "Find the 10th term of the Arithmetic Progression: 2, 5, 8, 11, ...", options: ["29", "32", "35", "28"], correct: 0 }
          ],
          hard: [
            { q: "If the sum of first n terms of an AP is given by Sn = 3n² + 5n, find the 2nd term.", options: ["10", "14", "18", "8"], correct: 1 }
          ]
        },
        boardMock: [
          { q: "ICSE Board Mock: A matrix of order 3×2 has how many elements?", options: ["5", "6", "9", "3"], correct: 1 }
        ]
      }
    }
  } 
};

// State tracker for selected Class & Subject
let arenaSelection = {
  classKey: null,
  subjectKey: null
};

// Persistent User State
let userProfile = JSON.parse(localStorage.getItem("conceptDeckUser")) || { 
  name: "", 
  totalCorrect: 0, 
  streak: 1, 
  lastActiveDate: null, 
  bookmarks: [], 
  badges: [],
  completedChapters: [] 
};

let currentSelection = { grade: null, subject: null, chapter: null };

// Handle Login
function handleLogin() {
  const nameInputEl = document.getElementById("student-name");
  const nameInput = nameInputEl ? nameInputEl.value.trim() : "";
  
  if (!nameInput) {
    alert("Please enter your name to get started!");
    return;
  }
  
  userProfile.name = nameInput;
  checkDailyStreak();
  renderDashboard();
}

function saveProfile() {
  localStorage.setItem("conceptDeckUser", JSON.stringify(userProfile));
  updateStatsDisplay();
}

function checkDailyStreak() {
  const today = new Date().toDateString();
  if (!userProfile.lastActiveDate) {
    userProfile.streak = 1;
    userProfile.lastActiveDate = today;
  } else if (userProfile.lastActiveDate !== today) {
    const lastDate = new Date(userProfile.lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = currentDate - lastDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      userProfile.streak += 1;
      userProfile.lastActiveDate = today;
    } else if (diffDays > 1) {
      userProfile.streak = 1;
      userProfile.lastActiveDate = today;
    }
  }
  checkMilestoneBadges();
  saveProfile();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  
  // Save preference
  localStorage.setItem("conceptDeckDarkMode", isDark);
  
  // Update button icon dynamically
  const btn = document.getElementById("dark-mode-btn");
  if (btn) {
    btn.innerText = isDark ? "☀️" : "🌙";
  }
}

// Check saved dark mode preference when the app loads
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("conceptDeckDarkMode") === "true") {
    document.body.classList.add("dark-mode");
    const btn = document.getElementById("dark-mode-btn");
    if (btn) btn.innerText = "☀️";
  }
});

function checkMilestoneBadges() {
  const badges = [];
  if (userProfile.totalCorrect >= 3) badges.push("⭐ Quiz Master");
  if (userProfile.streak >= 1) badges.push("🔥 Consistent Learner");
  if (userProfile.bookmarks && userProfile.bookmarks.length >= 1) badges.push("📌 Vault Keeper");
  userProfile.badges = badges;
}

function updateStatsDisplay() {
  document.querySelectorAll("#stat-score").forEach(el => el.innerText = userProfile.totalCorrect);
  document.querySelectorAll("#stat-streak").forEach(el => el.innerText = userProfile.streak);
  if (userProfile.name) {
    const greetingEl = document.getElementById("user-greeting-name");
    if (greetingEl) greetingEl.innerText = userProfile.name;
  }

  const badgeContainer = document.getElementById("badge-container");
  if (badgeContainer) {
    if (userProfile.badges.length > 0) {
      badgeContainer.innerHTML = userProfile.badges.map(b => `<div class="badge-pill">${b}</div>`).join('');
      badgeContainer.style.display = "flex";
    } else {
      badgeContainer.style.display = "none";
    }
  }
}

// Handle Logout
function handleLogout() {
  localStorage.removeItem("conceptDeckUser");
  userProfile = { name: "", totalCorrect: 0, streak: 1, lastActiveDate: null, bookmarks: [], badges: [], completedChapters: [] };
  const nameInput = document.getElementById("student-name");
  if (nameInput) nameInput.value = "";
  switchScreen("login-screen");
}

// 1. Render Dashboard Hub
function renderDashboard() {
  checkDailyStreak();
  updateStatsDisplay();
  currentSelection.grade = null;
  currentSelection.subject = null;
  currentSelection.chapter = null;
  
  const vaultList = document.getElementById("vault-list");
  if (vaultList) {
    if (userProfile.bookmarks.length === 0) {
      vaultList.innerHTML = `<div class="empty-vault">No bookmarked chapters yet. Tap the ⭐ star icon inside any chapter to add it here for quick revision!</div>`;
    } else {
      vaultList.innerHTML = userProfile.bookmarks.map(b => `
        <div class="vault-item" onclick="selectSearchedChapter('${b.gradeKey}', '${b.subjectKey}', '${b.chapterId}')">
          <div>
            <h5>${b.title}</h5>
            <span>${b.gradeKey === 'class-8' ? 'Class 8' : 'Class 9'} • Bookmarked</span>
          </div>
          <div>→</div>
        </div>
      `).join('');
    }
  }

  const gradeGrid = document.getElementById("grade-grid");
  if (gradeGrid) {
    gradeGrid.innerHTML = "";

    Object.keys(conceptDeckData).forEach(gradeKey => {
      const grade = conceptDeckData[gradeKey];
      const card = document.createElement("div");
      card.className = "selection-card";
      card.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 6px;">🎓</div>
        <h3 style="font-size: 0.95rem; margin-bottom: 2px;">${grade.name}</h3>
        <p style="font-size: 0.75rem; color: #64748b;">ICSE Curriculum</p>
      `;

      card.addEventListener("click", (e) => {
  const cardElement = e.currentTarget;
  cardElement.classList.add("clicked");
  setTimeout(() => {
    currentSelection.grade = gradeKey;
    renderSubjects(gradeKey);
  }, 150);
});

      gradeGrid.appendChild(card);
    });
  }

  switchScreen("dashboard-screen");
}

// Instant Global Search Logic
function handleGlobalSearch(query) {
  const dropdown = document.getElementById("search-results-dropdown");
  if (!query.trim()) {
    dropdown.innerHTML = "";
    dropdown.classList.add("hidden");
    return;
  }

  let matches = [];
  const q = query.toLowerCase();

  Object.keys(conceptDeckData).forEach(gradeKey => {
    const grade = conceptDeckData[gradeKey];
    Object.keys(grade.subjects).forEach(subjectKey => {
      const subject = grade.subjects[subjectKey];
      subject.chapters.forEach(ch => {
        if (ch.title.toLowerCase().includes(q) || ch.summary.toLowerCase().includes(q)) {
          matches.push({ gradeKey, subjectKey, chapter: ch, gradeName: grade.name, subjectTitle: subject.title });
        }
      });
    });
  });

  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="search-item"><span>No results</span><h4>No chapters match "${query}"</h4></div>`;
  } else {
    dropdown.innerHTML = matches.map(m => `
      <div class="search-item" onclick="selectSearchedChapter('${m.gradeKey}', '${m.subjectKey}', '${m.chapter.id}')">
        <span>${m.gradeName} • ${m.subjectTitle}</span>
        <h4>${m.chapter.title}</h4>
      </div>
    `).join('');
  }
  dropdown.classList.remove("hidden");
}
function handleActionPill(target, pillElement) {
  // Update active styling across pills
  document.querySelectorAll('.action-pill').forEach(pill => pill.classList.remove('active'));
  if (pillElement) pillElement.classList.add('active');

  if (target === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (target === 'classes') {
    const gradeGrid = document.getElementById('grade-grid');
    if (gradeGrid) {
      gradeGrid.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (target === 'arena') {
    openExamArena();
  } else if (target === 'vault') {
    const vaultSection = document.querySelector('.vault-section');
    if (vaultSection) {
      vaultSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function selectSearchedChapter(gradeKey, subjectKey, chapterId) {
  const dropdown = document.getElementById("search-results-dropdown");
  if (dropdown) dropdown.classList.add("hidden");
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) searchInput.value = "";

  currentSelection.grade = gradeKey;
  currentSelection.subject = subjectKey;
  const chapter = conceptDeckData[gradeKey].subjects[subjectKey].chapters.find(c => c.id === chapterId);
  currentSelection.chapter = chapter;
  
  renderPracticeView(gradeKey, subjectKey, chapter);
}

// 2. Render Subject Hub with Progress Bars
function renderSubjects(gradeKey) {
  const gradeData = conceptDeckData[gradeKey];
  const subjectGrid = document.getElementById("subject-grid");
  document.getElementById("subject-screen-title").innerText = `${gradeData.name} Subjects`;
  
  subjectGrid.innerHTML = "";

  Object.keys(gradeData.subjects).forEach(subjectKey => {
    const subject = gradeData.subjects[subjectKey];
    
    const totalChapters = subject.chapters.length;
    const completedCount = subject.chapters.filter(ch => userProfile.completedChapters.includes(ch.id)).length;
    const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

    const card = document.createElement("div");
    card.className = "selection-card";
    card.innerHTML = `
      <div style="font-size: 1.5rem; margin-bottom: 6px;">${subject.icon}</div>
      <h3 style="font-size: 0.95rem; margin-bottom: 2px;">${subject.title}</h3>
      
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="progress-meta">
        <span>${completedCount}/${totalChapters} Mastered</span>
        <span>${progressPercent}%</span>
      </div>
    `;

    card.addEventListener("click", (e) => {
  const cardElement = e.currentTarget;
  cardElement.classList.add("clicked");
  setTimeout(() => {
    currentSelection.subject = subjectKey;
    renderChapters(gradeKey, subjectKey);
  }, 150);
});

    subjectGrid.appendChild(card);
  });

  switchScreen("subject-screen");
}

// 3. Render Chapter Roadmap (Combines Static Data + Live Supabase Data)
async function renderChapters(gradeKey, subjectKey) {
  const subjectData = conceptDeckData[gradeKey]?.subjects[subjectKey];
  const chapterList = document.getElementById("chapter-list");
  
  if (subjectData) {
    document.getElementById("chapter-screen-title").innerText = `${subjectData.title} Chapters`;
  } else {
    document.getElementById("chapter-screen-title").innerText = "Chapters";
  }

  chapterList.innerHTML = `<p style="text-align: center; color: var(--text-muted);">⏳ Loading chapters...</p>`;

  // 1. Get hardcoded local chapters if present
  const localChapters = subjectData?.chapters || [];

  // 2. Fetch live published chapters from Supabase
  const supabaseChapters = await fetchChaptersFromSupabase(gradeKey, subjectKey);

  // 3. Combine both sources into one list
  const allChapters = [...localChapters, ...supabaseChapters];

  chapterList.innerHTML = "";

  if (allChapters.length === 0) {
    chapterList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No chapters available yet for this subject.</p>`;
    switchScreen("chapter-screen");
    return;
  }

  // 4. Render all combined chapters on the roadmap
  allChapters.forEach((ch, index) => {
    const row = document.createElement("div");
    row.className = "chapter-row";
    row.innerHTML = `
      <div class="chapter-meta">
        <span>Chapter ${index + 1}</span>
        <h4>${ch.title}</h4>
      </div>
      <div class="chapter-action">Start →</div>
    `;
    row.addEventListener("click", () => {
      currentSelection.chapter = ch;
      renderPracticeView(gradeKey, subjectKey, ch);
    });
    chapterList.appendChild(row);
  });

  switchScreen("chapter-screen");
}

// Bookmark Toggle Functionality
function toggleCurrentChapterBookmark() {
  if (!currentSelection.grade || !currentSelection.subject || !currentSelection.chapter) return;
  
  const { grade, subject, chapter } = currentSelection;
  const index = userProfile.bookmarks.findIndex(b => b.chapterId === chapter.id);
  const bookmarkBtn = document.getElementById("practice-bookmark-btn");

  if (index > -1) {
    userProfile.bookmarks.splice(index, 1);
    if (bookmarkBtn) bookmarkBtn.classList.remove("bookmarked");
  } else {
    userProfile.bookmarks.push({ 
      gradeKey: grade, 
      subjectKey: subject, 
      chapterId: chapter.id, 
      title: chapter.title 
    });
    if (bookmarkBtn) bookmarkBtn.classList.add("bookmarked");
  }
  
  checkMilestoneBadges();
  saveProfile();
}

function updateBookmarkButtonState() {
  const bookmarkBtn = document.getElementById("practice-bookmark-btn");
  if (!bookmarkBtn || !currentSelection.chapter) return;
  
  const isBookmarked = userProfile.bookmarks.some(b => b.chapterId === currentSelection.chapter.id);
  if (isBookmarked) {
    bookmarkBtn.classList.add("bookmarked");
  } else {
    bookmarkBtn.classList.remove("bookmarked");
  }
}
// ==========================================
// FLASHCARD ENGINE STATE & CONTROLLER
// ==========================================
let activeFlashcardState = {
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  masteredCount: 0
};

function getChapterFlashcards(chapter) {
  if (chapter.flashcards && chapter.flashcards.length > 0) {
    return chapter.flashcards;
  }
  
  const fallbackDeck = [];
  if (chapter.summary) {
    fallbackDeck.push({
      front: `What is the core summary of "${chapter.title}"?`,
      back: chapter.summary
    });
  }
  if (chapter.question) {
    fallbackDeck.push({
      front: `Practice Problem Prompt: ${chapter.title}`,
      back: chapter.question
    });
  }
  if (chapter.quiz && chapter.quiz.length > 0) {
    chapter.quiz.forEach(qItem => {
      fallbackDeck.push({
        front: qItem.q,
        back: `Answer: ${qItem.options[qItem.correct]}`
      });
    });
  }
  return fallbackDeck;
}

function renderFlashcardComponent(chapter) {
  const cards = getChapterFlashcards(chapter);
  if (!cards || cards.length === 0) return "";

  activeFlashcardState = {
    cards: cards,
    currentIndex: 0,
    isFlipped: false,
    masteredCount: 0
  };

  return `
    <div class="flashcard-deck-container" id="flashcard-deck-module">
      <div class="flashcard-header">
        <h3 style="font-size: 0.95rem; margin: 0; display: flex; align-items: center; gap: 6px;">
          🎴 Active Recall Flashcards
        </h3>
        <span id="flashcard-counter-tag" style="font-size: 0.8rem; font-weight: 700; color: #6366f1;">
          1 / ${cards.length}
        </span>
      </div>

      <div class="flashcard-progress-bar-bg">
        <div class="flashcard-progress-bar-fill" id="flashcard-progress-fill" style="width: ${Math.round((1 / cards.length) * 100)}%;"></div>
      </div>

      <!-- 3D FLIP CONTAINER -->
      <div class="flashcard-3d-wrapper" onclick="toggleFlashcardFlip()">
        <div class="flashcard-inner" id="active-flashcard-inner">
          
          <!-- FRONT FACE -->
          <div class="flashcard-face flashcard-front">
            <span class="flashcard-badge">Question / Concept</span>
            <div class="flashcard-body-text" id="flashcard-front-text">${cards[0].front}</div>
            <span class="flashcard-hint-text">🔄 Tap anywhere to flip</span>
          </div>

          <!-- BACK FACE -->
          <div class="flashcard-face flashcard-back">
            <span class="flashcard-badge">Answer & Solution</span>
            <div class="flashcard-body-text" id="flashcard-back-text">${cards[0].back}</div>
            <span class="flashcard-hint-text">How well did you recall this?</span>
          </div>

        </div>
      </div>

      <!-- RATING ACTION BUTTONS -->
      <div class="flashcard-rating-bar" id="flashcard-rating-controls" style="visibility: hidden;">
        <button class="flashcard-btn btn-review-again" onclick="rateFlashcard('review')">
          🔴 Needs Review
        </button>
        <button class="flashcard-btn btn-got-it" onclick="rateFlashcard('mastered')">
          🟢 Got It!
        </button>
      </div>
    </div>
  `;
}

function toggleFlashcardFlip() {
  const innerCard = document.getElementById("active-flashcard-inner");
  const ratingControls = document.getElementById("flashcard-rating-controls");
  
  if (!innerCard) return;

  activeFlashcardState.isFlipped = !activeFlashcardState.isFlipped;
  
  if (activeFlashcardState.isFlipped) {
    innerCard.classList.add("is-flipped");
    if (ratingControls) ratingControls.style.visibility = "visible";
  } else {
    innerCard.classList.remove("is-flipped");
  }
}

function rateFlashcard(rating) {
  const state = activeFlashcardState;
  const currentCard = state.cards[state.currentIndex];

  if (rating === "review") {
    state.cards.push(currentCard);
  } else if (rating === "mastered") {
    state.masteredCount++;
  }

  state.currentIndex++;
  state.isFlipped = false;

  const innerCard = document.getElementById("active-flashcard-inner");
  const ratingControls = document.getElementById("flashcard-rating-controls");
  
  if (innerCard) innerCard.classList.remove("is-flipped");
  if (ratingControls) ratingControls.style.visibility = "hidden";

  if (state.currentIndex >= state.cards.length) {
    renderFlashcardDeckCompletion();
    return;
  }

  setTimeout(() => {
    updateFlashcardDOM();
  }, 250);
}

function updateFlashcardDOM() {
  const state = activeFlashcardState;
  const card = state.cards[state.currentIndex];

  const frontText = document.getElementById("flashcard-front-text");
  const backText = document.getElementById("flashcard-back-text");
  const counterTag = document.getElementById("flashcard-counter-tag");
  const progressFill = document.getElementById("flashcard-progress-fill");

  if (frontText) frontText.innerText = card.front;
  if (backText) backText.innerText = card.back;
  
  if (counterTag) {
    counterTag.innerText = `${state.currentIndex + 1} / ${state.cards.length}`;
  }

  if (progressFill) {
    const percent = Math.round(((state.currentIndex + 1) / state.cards.length) * 100);
    progressFill.style.width = `${percent}%`;
  }
}

function renderFlashcardDeckCompletion() {
  const moduleContainer = document.getElementById("flashcard-deck-module");
  if (!moduleContainer) return;

  moduleContainer.innerHTML = `
    <div class="quiz-completion-banner" style="margin: 0; text-align: center; padding: 24px;">
      <div class="completion-content">
        <h4 style="color: #10b981; font-size: 1.1rem; margin-bottom: 6px;">🎉 Flashcard Deck Mastered!</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
          You reviewed all ${activeFlashcardState.cards.length} cards in this chapter.
        </p>
        <button class="primary-btn sm" onclick="renderPracticeView(currentSelection.grade, currentSelection.subject, currentSelection.chapter)">
          🔄 Practice Again
        </button>
      </div>
    </div>
  `;
}
// 4. Render Practice & Quiz View
function renderPracticeView(gradeKey, subjectKey, chapter) {
  currentSelection.grade = gradeKey;
  currentSelection.subject = subjectKey;
  currentSelection.chapter = chapter;

  const gradeData = conceptDeckData[gradeKey];
  const subjectData = gradeData.subjects[subjectKey];

  document.getElementById("practice-chapter-title").innerText = chapter.title;
  document.getElementById("practice-subject-tag").innerText = `${gradeData.name} • ${subjectData.title}`;
  
  updateBookmarkButtonState();

  const contentArea = document.getElementById("practice-content-area");
  
  let quizHTML = "";
  if (chapter.quiz && chapter.quiz.length > 0) {
    quizHTML = `<div class="sample-quiz-box">
      <h3>Interactive Chapter Quiz</h3>
      <div id="quiz-container">`;
      
    chapter.quiz.forEach((qItem, qIndex) => {
      quizHTML += `
        <div class="quiz-question-card" data-question="${qIndex}">
          <p><strong>Q${qIndex + 1}:</strong> ${qItem.q}</p>
          <div class="options-grid">
            ${qItem.options.map((opt, optIndex) => `
              <button class="quiz-option-btn" onclick="handleQuizAnswer(${qIndex}, ${optIndex}, ${qItem.correct}, this)">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>`;
    });

    quizHTML += `</div></div>`;
  }

  contentArea.innerHTML = `
    <h3>Core Concept Review</h3>
    <p>${chapter.summary}</p>

    <!-- 👇 THIS CALLS THE FLASHCARD COMPONENT WE JUST PASTED -->
    ${renderFlashcardComponent(chapter)}
    
    <div class="sample-quiz-box">
      <h3>Quick Check Practice Problem</h3>
      <p><strong>Problem:</strong> ${chapter.question}</p>
      <button class="action-btn" id="toggle-solution-btn">Reveal Step-by-Step Solution</button>
      <div id="solution-container" class="solution-box hidden">
        <p><strong>Solution Guide:</strong> ${chapter.solution || chapter.summary}</p>
      </div>
    </div>

    ${quizHTML}
  `;

  document.getElementById("toggle-solution-btn").addEventListener("click", () => {
    const solutionBox = document.getElementById("solution-container");
    const btn = document.getElementById("toggle-solution-btn");
    solutionBox.classList.toggle("hidden");
    btn.innerText = solutionBox.classList.contains("hidden") ? "Reveal Step-by-Step Solution" : "Hide Solution";
  });

  switchScreen("practice-screen");
}

// 5. Handle Quiz Answer Logic with Mistake Feedback & Completion
function handleQuizAnswer(qIndex, selectedOpt, correctOpt, btnElement) {
  const parentCard = btnElement.closest(".quiz-question-card");
  if (parentCard.dataset.answered === "true") return;
  parentCard.dataset.answered = "true";

  const allButtons = parentCard.querySelectorAll(".quiz-option-btn");
  allButtons.forEach(btn => btn.disabled = true);

  const feedbackContainer = document.createElement("div");

  if (selectedOpt === correctOpt) {
    btnElement.classList.add("correct");
    userProfile.totalCorrect += 1;
    checkMilestoneBadges();
    saveProfile();
  } else {
    btnElement.classList.add("incorrect");
    allButtons[correctOpt].classList.add("correct");

    feedbackContainer.className = "mistake-feedback-box";
    feedbackContainer.innerHTML = `
      <strong>💡 Not quite right!</strong>
      <p>Take a quick second to review the core concept above, or try this question again.</p>
      <button class="retry-btn" onclick="resetQuizQuestion(this)">Try Again</button>
    `;
    parentCard.appendChild(feedbackContainer);
  }

  checkQuizCompletion(parentCard);
}

function resetQuizQuestion(retryBtn) {
  const parentCard = retryBtn.closest(".quiz-question-card");
  parentCard.dataset.answered = "false";
  
  const feedbackBox = parentCard.querySelector(".mistake-feedback-box");
  if (feedbackBox) feedbackBox.remove();

  const allButtons = parentCard.querySelectorAll(".quiz-option-btn");
  allButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("correct", "incorrect");
  });

  const quizContainer = parentCard.closest("#quiz-container");
  const banner = quizContainer.querySelector(".quiz-completion-banner");
  if (banner) banner.remove();
}

function checkQuizCompletion(referenceCard) {
  const quizContainer = referenceCard.closest("#quiz-container");
  const allCards = quizContainer.querySelectorAll(".quiz-question-card");
  const answeredCards = quizContainer.querySelectorAll('.quiz-question-card[data-answered="true"]');

  if (allCards.length === answeredCards.length && !quizContainer.querySelector(".quiz-completion-banner")) {
    const incorrectAnswersCount = quizContainer.querySelectorAll('.quiz-option-btn.incorrect').length;
    const completionMsg = document.createElement("div");
    completionMsg.className = "quiz-completion-banner";

    if (incorrectAnswersCount > 0) {
      completionMsg.innerHTML = `
        <div class="completion-content">
          <h4 style="color: #dc2626;">⚠️ Review & Master</h4>
          <p>You finished the quiz with some mistakes. Check feedback above and hit <strong>Try Again</strong>!</p>
          <button class="primary-btn sm" onclick="renderChapters(currentSelection.grade, currentSelection.subject)">← Back to Chapter List</button>
        </div>
      `;
    } else {
      if (currentSelection.chapter && !userProfile.completedChapters.includes(currentSelection.chapter.id)) {
        userProfile.completedChapters.push(currentSelection.chapter.id);
        checkMilestoneBadges();
        saveProfile();
      }

      completionMsg.innerHTML = `
        <div class="completion-content">
          <h4>🎉 Fantastic work!</h4>
          <p>You nailed every question and mastered this chapter's active recall quiz.</p>
          <button class="primary-btn sm" onclick="renderChapters(currentSelection.grade, currentSelection.subject)">← Back to Chapter List</button>
        </div>
      `;
    }
    quizContainer.appendChild(completionMsg);
  }
}

// Active Arena State Tracker
let arenaState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  title: ""
};

// Open Exam Arena (Screen 1: Class Selection)
function openExamArena() {
  arenaSelection.classKey = null;
  arenaSelection.subjectKey = null;
  renderQuizClasses();
  switchScreen("quiz-class-screen");
}

// Step 1: Render Classes on Screen 1
function renderQuizClasses() {
  const grid = document.getElementById("quiz-class-grid");
  if (!grid) return;

  grid.innerHTML = "";
  Object.keys(arenaQuestionBank).forEach(classKey => {
    const classData = arenaQuestionBank[classKey];
    const card = document.createElement("div");
    card.className = "selection-card";
    card.innerHTML = `
      <div style="font-size: 1.5rem; margin-bottom: 6px;">${classData.icon}</div>
      <h3 style="font-size: 0.95rem; margin-bottom: 2px;">${classData.title}</h3>
      <p style="font-size: 0.75rem; color: #64748b;">ICSE Curriculum</p>
    `;
    card.addEventListener("click", (e) => {
  const cardElement = e.currentTarget;
  cardElement.classList.add("clicked");
  setTimeout(() => {
    selectQuizClass(classKey);
  }, 150); // Small 150ms delay to let the animation play out smoothly
});
    grid.appendChild(card);
  });
}

// When Class is chosen, populate and go to Screen 2 (Subjects)
function selectQuizClass(classKey) {
  arenaSelection.classKey = classKey;
  const classData = arenaQuestionBank[classKey];
  
  document.getElementById("quiz-subject-screen-title").innerText = `${classData.title} Subjects`;
  document.getElementById("quiz-subject-desc").innerText = `Select a subject for ${classData.title}:`;
  
  const grid = document.getElementById("quiz-subject-grid");
  grid.innerHTML = "";

  Object.keys(classData.subjects).forEach(subjectKey => {
    const subjData = classData.subjects[subjectKey];
    const card = document.createElement("div");
    card.className = "selection-card";
    card.innerHTML = `
      <div style="font-size: 1.5rem; margin-bottom: 6px;">${subjData.icon}</div>
      <h3 style="font-size: 0.95rem; margin-bottom: 2px;">${subjData.title}</h3>
      <p style="font-size: 0.75rem; color: #64748b;">${classData.title} Exam</p>
    `;
    card.addEventListener("click", (e) => {
  const cardElement = e.currentTarget;
  cardElement.classList.add("clicked");
  setTimeout(() => {
    selectQuizSubject(subjectKey);
  }, 150);
});
    grid.appendChild(card);
  });

  switchScreen("quiz-subject-screen");
}

// When Subject is chosen, go to Screen 3 (Exam Format / Difficulty)
function selectQuizSubject(subjectKey) {
  arenaSelection.subjectKey = subjectKey;
  const subjData = arenaQuestionBank[arenaSelection.classKey].subjects[subjectKey];
  
  document.getElementById("quiz-mode-screen-title").innerText = `${subjData.title} Exam`;
  switchScreen("quiz-mode-screen");
}

// Start Practice Quiz (Screen 4: Active Quiz)
function startSubjectQuiz(level) {
  const { classKey, subjectKey } = arenaSelection;
  if (!classKey || !subjectKey) return;

  const questionsList = arenaQuestionBank[classKey].subjects[subjectKey].levels[level];
  const subjectTitle = arenaQuestionBank[classKey].subjects[subjectKey].title;
  const classTitle = arenaQuestionBank[classKey].title;

  if (!questionsList || questionsList.length === 0) {
    alert(`No questions available for ${subjectTitle} (${classTitle}) at ${level} level yet.`);
    return;
  }

  arenaState = {
    questions: questionsList,
    currentIndex: 0,
    score: 0,
    title: `${classTitle} • ${subjectTitle} (${level.toUpperCase()})`
  };

  document.getElementById("quiz-active-title").innerText = arenaState.title;
  switchScreen("quiz-active-screen");
  renderActiveArenaQuestion();
}

// Start Board Mock Test (Screen 4: Active Quiz)
function startSubjectBoardMock() {
  const { classKey, subjectKey } = arenaSelection;
  if (!classKey || !subjectKey) return;

  const questionsList = arenaQuestionBank[classKey].subjects[subjectKey].boardMock;
  const subjectTitle = arenaQuestionBank[classKey].subjects[subjectKey].title;
  const classTitle = arenaQuestionBank[classKey].title;

  if (!questionsList || questionsList.length === 0) {
    alert(`No board mock test available for ${subjectTitle} (${classTitle}) yet.`);
    return;
  }

  arenaState = {
    questions: questionsList,
    currentIndex: 0,
    score: 0,
    title: `📜 ${classTitle} • ${subjectTitle} Board Mock`
  };

  document.getElementById("quiz-active-title").innerText = arenaState.title;
  switchScreen("quiz-active-screen");
  renderActiveArenaQuestion();
}

// Render Question on Screen 4
function renderActiveArenaQuestion() {
  const container = document.getElementById("quiz-active-container");
  if (!container) return;

  if (arenaState.currentIndex >= arenaState.questions.length) {
    const percent = Math.round((arenaState.score / arenaState.questions.length) * 100);
    container.innerHTML = `
      <div class="quiz-completion-banner" style="margin-top: 0;">
        <div class="completion-content">
          <h4>🏆 Exam Completed Successfully!</h4>
          <p>Your Score: <strong>${arenaState.score} / ${arenaState.questions.length}</strong> (${percent}%)</p>
          <button class="primary-btn sm" onclick="switchScreen('quiz-mode-screen')">← Back to Exam Formats</button>
        </div>
      </div>
    `;
    return;
  }

  const currentQ = arenaState.questions[arenaState.currentIndex];
  
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="color: #818cf8; font-size: 0.95rem;">${arenaState.title}</h3>
      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Question ${arenaState.currentIndex + 1} of ${arenaState.questions.length}</span>
    </div>
    
    <div class="quiz-question-card" id="arena-q-card" style="margin-top: 0;">
      <p><strong>Q${arenaState.currentIndex + 1}:</strong> ${currentQ.q}</p>
      <div class="options-grid">
        ${currentQ.options.map((opt, idx) => `
          <button class="quiz-option-btn" onclick="handleArenaAnswer(${idx}, ${currentQ.correct}, this)">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;
}

// Handle Answer Selection
function handleArenaAnswer(selectedIdx, correctIdx, btnElement) {
  const card = document.getElementById("arena-q-card");
  if (card.dataset.answered === "true") return;
  card.dataset.answered = "true";

  const allButtons = card.querySelectorAll(".quiz-option-btn");
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedIdx === correctIdx) {
    btnElement.classList.add("correct");
    arenaState.score += 1;
    userProfile.totalCorrect += 1;
    saveProfile();
  } else {
    btnElement.classList.add("incorrect");
    allButtons[correctIdx].classList.add("correct");
  }

  setTimeout(() => {
    arenaState.currentIndex += 1;
    renderActiveArenaQuestion();
  }, 1500);
}

// Quit active quiz with confirmation lockdown
function quitActiveQuiz() {
  if (confirm("Are you sure you want to quit this test? Your current exam progress will be lost.")) {
    switchScreen('quiz-mode-screen');
  }
}

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) targetScreen.classList.add("active");
}

// App Initialization & Event Binding on Page Load
window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  const nameInputEl = document.getElementById("student-name");
  if (nameInputEl) {
    nameInputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const backDashboard = document.getElementById("back-to-dashboard");
  if (backDashboard) backDashboard.addEventListener("click", renderDashboard);

  const backSubjects = document.getElementById("back-to-subjects");
  if (backSubjects) backSubjects.addEventListener("click", () => renderSubjects(currentSelection.grade));

  const backChapters = document.getElementById("back-to-chapters");
  if (backChapters) backChapters.addEventListener("click", () => renderChapters(currentSelection.grade, currentSelection.subject));

  if (userProfile.name && userProfile.name.trim() !== "") {
    checkDailyStreak();
    renderDashboard();
  } else {
    switchScreen("login-screen");
  }
});
