const coursesData = [
  "📖 دورة تثبيت القرآن الكريم",
  "🎓 دبلوم اللغة الإنجليزية",
  "🚀 دبلوم صناعة العباقرة",
  "💡 دورة التفكير الإبداعي",
  "📊 دورة التسويق الرقمي",
  "🧠 دورة فنون الذاكرة الخارقة",
  "🗣️ دورة مهارات التواصل الفعال",
  "🎯 دورة تحديد الأهداف وخطوات تحقيقها",
  "✍️ دورة الخط العربي للمبتدئين",
  "💻 دورة أساسيات البرمجة للمبتدئين"
];

const coursesSlider = document.getElementById("coursesSlider");
let coursesCurrentIndex = 0;
let autoSlideInterval;

function createCourseCards() {
    coursesSlider.innerHTML = '';
    coursesData.forEach(course => {
        const div = document.createElement("div");
        div.className = "course-card";
        div.innerHTML = `<span class="course-title">${course}</span>`;
        coursesSlider.appendChild(div);
    });
}

function moveCoursesSlider() {
  const cardWidth = document.querySelector('.course-card').offsetWidth;
  const gap = 25;
  const totalCardWidth = cardWidth + gap;
  
  const visibleCards = Math.floor(coursesSlider.parentElement.offsetWidth / totalCardWidth);
  
  coursesCurrentIndex++;
  if (coursesCurrentIndex > (coursesData.length - visibleCards)) {
    coursesCurrentIndex = 0;
  }

  coursesSlider.style.transform = `translateX(-${coursesCurrentIndex * totalCardWidth}px)`;
}

createCourseCards();
autoSlideInterval = setInterval(moveCoursesSlider, 5000);

window.addEventListener('resize', () => {
    clearInterval(autoSlideInterval);
    coursesCurrentIndex = 0;
    coursesSlider.style.transform = `translateX(0px)`;
    createCourseCards();
    autoSlideInterval = setInterval(moveCoursesSlider, 5000);
});
