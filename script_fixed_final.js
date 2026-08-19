/* =========================================================
   3.1 - KHỞI TẠO HỆ THỐNG
   B.E.H.A.V JOURNAL
========================================================= */


/* =========================================================
   01. DỮ LIỆU HỌC SINH
========================================================= */

const currentStudent = {
    id: "student_001",
    name: "Nam",
    className: "8A1"
};


/* =========================================================
   02. DỮ LIỆU GIÁO VIÊN
========================================================= */

const currentTeacher = {
    id: "teacher_001",
    name: "Nguyễn Thị A"
};


/* =========================================================
   03. CẤU TRÚC NHẬT KÝ MẪU
========================================================= */

const defaultJournals = [
    {
        id: "journal_001",

        studentId: "student_001",

        date: "10/08/2026",

        situation: "Em nói chuyện trong giờ Toán và bị cô giáo nhắc nhở.",

        emotion: "Tức giận",

        emotionReason:
            "Em bực vì nghĩ mình không làm gì sai.",

        stop: [
            "Em im lặng",
            "Em hít thở sâu",
            "Em không phản ứng ngay"
        ],

        think:
            "Nếu tiếp tục tranh cãi, có thể ảnh hưởng đến tiết học.",

        select:
            "Nhận lỗi",

        result:
            "Tiết học diễn ra bình thường. Sau giờ em đã hỏi cô phần bài chưa hiểu.",

        rating: 4,

        doDifferent:
            "Không",

        lesson:
            "Khi bình tĩnh suy nghĩ, em có thể giải quyết vấn đề tốt hơn.",

        goals: [
            "Bình tĩnh khi được nhắc nhở"
        ],

        feedback: {
            teacherId: "teacher_001",

            teacherName: "Nguyễn Thị A",

            date: "10/08/2026",

            content:
                "Cô ghi nhận em đã biết bình tĩnh và lựa chọn cách xử lý phù hợp. Em đã biết sử dụng 3S đúng lúc."
        }
    }
];


/* =========================================================
   04. LẤY DỮ LIỆU TỪ LOCAL STORAGE
========================================================= */

let journals = [];

try {

    const savedJournals =
        localStorage.getItem(
            "behav_journals"
        );

    if (savedJournals) {

        const parsedJournals =
            JSON.parse(
                savedJournals
            );

        journals =
            Array.isArray(
                parsedJournals
            )
                ? parsedJournals
                : [];

    }

} catch (error) {

    console.warn(
        "Dữ liệu nhật ký cũ không hợp lệ. Đang khởi tạo lại.",
        error
    );

    journals = [];

    localStorage.removeItem(
        "behav_journals"
    );

}

/* =========================================================
   05. NẾU CHƯA CÓ DỮ LIỆU
      → TẠO DỮ LIỆU MẪU
========================================================= */

if (journals.length === 0) {

    journals = defaultJournals;

    localStorage.setItem(
        "behav_journals",
        JSON.stringify(journals)
    );
}


/* =========================================================
   06. BIẾN TRẠNG THÁI NHẬT KÝ
========================================================= */

const journalState = {

    currentStep: 1,

    emotion: "",

    emotionReason: "",

    rating: 0,

    stop: [],

    think: "",

    select: "",

    result: "",

    doDifferent: "",

    lesson: "",

    goals: []
};


/* =========================================================
   07. BIẾN TRẠNG THÁI GIAO DIỆN
========================================================= */

let currentPage = "dashboard";


/* =========================================================
   08. DOM ELEMENT CƠ BẢN
========================================================= */

const pages =
    document.querySelectorAll(".page");


const menuItems =
    document.querySelectorAll(".menu-item");


/* =========================================================
   09. HÀM LƯU NHẬT KÝ
========================================================= */

function saveJournals() {

    localStorage.setItem(
        "behav_journals",
        JSON.stringify(journals)
    );
}


/* =========================================================
   10. HÀM TẠO ID
========================================================= */

function createId(prefix = "id") {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 7)
    );
}


/* =========================================================
   11. LOG KIỂM TRA
========================================================= */

console.log(
    "B.E.H.A.V Journal đã khởi tạo."
);

console.log(
    "Số nhật ký:",
    journals.length
);

/* =========================================================
   F1 — DỮ LIỆU GIÁO VIÊN
========================================================= */

/*
 * Lấy toàn bộ nhật ký của học sinh hiện tại
 */
function getTeacherJournals() {

    if (!Array.isArray(journals)) {
        return [];
    }

    return journals.filter(journal => {

        if (!journal) {
            return false;
        }

        /*
         * Nếu nhật ký có studentId thì chỉ lấy
         * nhật ký thuộc học sinh.
         */
        if (journal.studentId) {
            return (
                journal.studentId ===
                currentStudent.id
            );
        }

        return true;
    });
}


/*
 * Tìm một nhật ký cụ thể
 */
function getTeacherJournalById(journalId) {

    return getTeacherJournals().find(
        journal =>
            String(journal.id) ===
            String(journalId)
    ) || null;
}


/*
 * Kiểm tra nhật ký đã được phản hồi chưa
 */
function teacherJournalHasFeedback(journal) {

    if (
        !journal ||
        !journal.feedback
    ) {
        return false;
    }

    if (
        typeof journal.feedback ===
        "object"
    ) {

        return Boolean(
            String(
                journal.feedback.content ||
                ""
            ).trim()
        );
    }

    return Boolean(
        String(
            journal.feedback
        ).trim()
    );
}


/*
 * Lấy trạng thái của nhật ký
 */
function getTeacherJournalStatus(journal) {

    return teacherJournalHasFeedback(journal)
        ? "Đã phản hồi"
        : "Chờ phản hồi";
}


/*
 * Lấy thông tin tổng quan cho giáo viên
 */
function getTeacherJournalStats() {

    const teacherJournals =
        getTeacherJournals();

    const total =
        teacherJournals.length;

    const replied =
        teacherJournals.filter(
            journal =>
                teacherJournalHasFeedback(
                    journal
                )
        ).length;

    const pending =
        total - replied;

    return {
        total,
        replied,
        pending
    };
}


/*
 * Lưu dữ liệu sau khi giáo viên thay đổi
 */
function saveTeacherData() {

    saveJournals();

    console.log(
        "Dữ liệu giáo viên đã được cập nhật."
    );
}

/* =========================================================
   3.2 - CHUYỂN GIAO DIỆN
========================================================= */


/* =========================================================
   01. HÀM CHUYỂN PAGE
========================================================= */

function showPage(pageId) {

    // Lấy tất cả giao diện
    const allPages =
        document.querySelectorAll(".page");


    // Ẩn tất cả giao diện
    allPages.forEach(page => {

        page.classList.remove("active");

    });


    // Tìm giao diện cần mở
    const targetPage =
        document.getElementById(pageId);


    // Nếu tồn tại → mở
    if (targetPage) {

        targetPage.classList.add("active");

        currentPage = pageId;

    }


    // Cập nhật menu
    updateActiveMenu(pageId);


    // Cuộn lên đầu
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   02. CẬP NHẬT MENU ACTIVE
========================================================= */

function updateActiveMenu(pageId) {

    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    const activeItem =
        document.querySelector(
            `.menu-item[data-page="${pageId}"]`
        );


    if (activeItem) {

        activeItem.classList.add("active");

    }
}


/* =========================================================
   03. CLICK MENU
========================================================= */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function () {

            const pageId =
                this.dataset.page;


            if (!pageId) return;


            showPage(pageId);

        }
    );

});


/* =========================================================
   04. CÁC NÚT data-page
   Ví dụ:
   + Ghi nhật ký hôm nay
   Xem tất cả
========================================================= */

document
    .querySelectorAll("[data-page]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const pageId =
                    this.dataset.page;


                if (!pageId) return;


                showPage(pageId);

            }
        );

    });


/* =========================================================
   05. KHỞI ĐỘNG PAGE MẶC ĐỊNH
========================================================= */

showPage("home");

/* =========================================================
   3.3 - SIDEBAR ACTIVE & NAVIGATION
========================================================= */


/* =========================================================
   01. LẤY TOÀN BỘ NÚT ĐIỀU HƯỚNG
========================================================= */

const navigationButtons =
    document.querySelectorAll("[data-page]");


/* =========================================================
   02. HÀM CẬP NHẬT ACTIVE
========================================================= */

function setActiveNavigation(pageId) {

    navigationButtons.forEach(button => {

        const targetPage =
            button.dataset.page;


        /*
         * Chỉ active những nút thuộc
         * thanh điều hướng chính.
         *
         * Các nút CTA như
         * "+ Ghi nhật ký hôm nay"
         * không cần active.
         */

        if (
            button.classList.contains("menu-item")
        ) {

            button.classList.toggle(
                "active",
                targetPage === pageId
            );

        }

    });
}


/* =========================================================
   03. HÀM CHUYỂN PAGE
   PHIÊN BẢN HOÀN CHỈNH
========================================================= */

function navigateTo(pageId) {

    const targetPage =
        document.getElementById(pageId);


    // Không tồn tại page → dừng
    if (!targetPage) {

        console.warn(
            "Không tìm thấy giao diện:",
            pageId
        );

        return;

    }


    /* -----------------------------------------
       ẨN TẤT CẢ PAGE
    ----------------------------------------- */

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    /* -----------------------------------------
       HIỆN PAGE ĐƯỢC CHỌN
    ----------------------------------------- */

    targetPage.classList.add("active");


    /* -----------------------------------------
       CẬP NHẬT TRẠNG THÁI
    ----------------------------------------- */

    currentPage = pageId;


    /* -----------------------------------------
       ACTIVE SIDEBAR
    ----------------------------------------- */

    setActiveNavigation(pageId);


    /* -----------------------------------------
       CUỘN LÊN ĐẦU
    ----------------------------------------- */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   04. CLICK SIDEBAR
========================================================= */

document
    .querySelectorAll(".menu-item[data-page]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const pageId =
                    button.dataset.page;

                navigateTo(pageId);

            }
        );

    });


/* =========================================================
   05. CLICK CÁC NÚT CTA
   Ví dụ:
   + Ghi nhật ký hôm nay
   Xem tất cả
========================================================= */

document
    .querySelectorAll(
        "button[data-page]:not(.menu-item)"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const pageId =
                    button.dataset.page;

                navigateTo(pageId);

            }
        );

    });


/* =========================================================
   06. PAGE MẶC ĐỊNH
========================================================= */

navigateTo("home");


/* =========================================================
   03. NÚT TIẾP TỤC
========================================================= */

document
    .querySelectorAll(".next-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const nextStep =
                    Number(
                        button.dataset.next
                    );


                if (!nextStep) return;


                /*
                 * Kiểm tra bước hiện tại
                 * trước khi đi tiếp.
                 */

                if (
                    !validateJournalStep(
                        journalState.currentStep
                    )
                ) {

                    return;

                }


                collectJournalStepData(
                    journalState.currentStep
                );


                showJournalStep(nextStep);

            }
        );

    });


/* =========================================================
   04. NÚT QUAY LẠI
========================================================= */

document
    .querySelectorAll(".prev-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const previousStep =
                    Number(
                        button.dataset.prev
                    );


                if (!previousStep) return;


                collectJournalStepData(
                    journalState.currentStep
                );


                showJournalStep(
                    previousStep
                );

            }
        );

    });


/* =========================================================
   05. THU THẬP DỮ LIỆU TỪ TỪNG BƯỚC
========================================================= */

function collectJournalStepData(stepNumber) {


    /* -----------------------------------------
       BƯỚC 1 - TÌNH HUỐNG
    ----------------------------------------- */

    if (stepNumber === 1) {

        const situation =
document.getElementById(
    "journal-situation"
);


        if (situation) {

            journalState.situation =
                situation.value.trim();

        }

    }


    /* -----------------------------------------
       BƯỚC 2 - CẢM XÚC
    ----------------------------------------- */

    if (stepNumber === 2) {

        const reason =
            document.getElementById(
                "emotion-reason"
            );


        journalState.emotionReason =
            reason
                ? reason.value.trim()
                : "";

    }


    /* -----------------------------------------
       BƯỚC 3 - 3S
    ----------------------------------------- */

    if (stepNumber === 3) {

        journalState.stop =
            Array.from(
                document.querySelectorAll(
                    'input[name="stop"]:checked'
                )
            ).map(
                input => input.value
            );


        const think =
            document.getElementById(
                "think"
            );


        journalState.think =
            think
                ? think.value.trim()
                : "";


        const select =
            document.querySelector(
                'input[name="select"]:checked'
            );


        journalState.select =
            select
                ? select.value
                : "";

    }


    /* -----------------------------------------
       BƯỚC 4 - KẾT QUẢ
    ----------------------------------------- */

    if (stepNumber === 4) {

        const result =
            document.getElementById(
                "result"
            );


        journalState.result =
            result
                ? result.value.trim()
                : "";


        const different =
            document.querySelector(
                'input[name="do-different"]:checked'
            );


        journalState.doDifferent =
            different
                ? different.value
                : "";

    }


    /* -----------------------------------------
       BƯỚC 5 - BÀI HỌC + MỤC TIÊU
    ----------------------------------------- */

    if (stepNumber === 5) {

        const lesson =
            document.getElementById(
                "lesson"
            );


        journalState.lesson =
            lesson
                ? lesson.value.trim()
                : "";


        journalState.goals =
            Array.from(
                document.querySelectorAll(
                    'input[name="goal"]:checked'
                )
            ).map(
                input => input.value
            );

    }

}


/* =========================================================
   06. KIỂM TRA DỮ LIỆU CƠ BẢN
========================================================= */

function validateJournalStep(stepNumber) {


    /* -----------------------------------------
       BƯỚC 1
    ----------------------------------------- */

    if (stepNumber === 1) {

        const situation =
            document.getElementById(
    "journal-situation"
);

        if (
            !situation ||
            !situation.value.trim()
        ) {

            showToast(
                "Em hãy nhập tình huống trước nhé."
            );

            situation?.focus();

            return false;

        }

    }


    /* -----------------------------------------
       BƯỚC 2
    ----------------------------------------- */

    if (stepNumber === 2) {

        if (!journalState.emotion) {

            showToast(
                "Em hãy chọn một cảm xúc nhé."
            );

            return false;

        }

    }


    /* -----------------------------------------
       BƯỚC 3
    ----------------------------------------- */

    if (stepNumber === 3) {

        const select =
            document.querySelector(
                'input[name="select"]:checked'
            );


        if (!select) {

            showToast(
                "Em hãy chọn cách xử lý của mình."
            );

            return false;

        }

    }


    /* -----------------------------------------
       BƯỚC 4
    ----------------------------------------- */

    if (stepNumber === 4) {

        const result =
            document.getElementById(
                "result"
            );


        if (
            !result ||
            !result.value.trim()
        ) {

            showToast(
                "Em hãy nhập kết quả nhé."
            );

            result?.focus();

            return false;

        }

    }


    /* -----------------------------------------
       Nếu hợp lệ
    ----------------------------------------- */

    return true;
}


/* =========================================================
   3.5 - CHỌN CẢM XÚC
========================================================= */


/* =========================================================
   01. LẤY DANH SÁCH CẢM XÚC
========================================================= */

const emotionItems =
    document.querySelectorAll(".emotion-item");


/* =========================================================
   02. XỬ LÝ KHI HỌC SINH CHỌN CẢM XÚC
========================================================= */

emotionItems.forEach(item => {

    item.addEventListener(
        "click",
        function () {

            /* -----------------------------------------
               Bỏ chọn tất cả cảm xúc
            ----------------------------------------- */

            emotionItems.forEach(emotion => {

                emotion.classList.remove(
                    "selected"
                );

            });


            /* -----------------------------------------
               Chọn cảm xúc hiện tại
            ----------------------------------------- */

            this.classList.add(
                "selected"
            );


            /* -----------------------------------------
               Lưu vào state
            ----------------------------------------- */

            journalState.emotion =
                this.dataset.emotion;


            /* -----------------------------------------
               Hiệu ứng thông báo nhẹ
            ----------------------------------------- */

            console.log(
                "Cảm xúc đã chọn:",
                journalState.emotion
            );

        }
    );

});

/* =========================================================
   3.6 - CHỌN MỨC ĐỘ HÀI LÒNG
========================================================= */


/* =========================================================
   01. LẤY CÁC NÚT RATING
========================================================= */

const ratingButtons =
    document.querySelectorAll(".rating button");


/* =========================================================
   02. XỬ LÝ KHI CHỌN RATING
========================================================= */

ratingButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            /* -----------------------------------------
               Bỏ trạng thái selected
            ----------------------------------------- */

            ratingButtons.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            /* -----------------------------------------
               Chọn mức hiện tại
            ----------------------------------------- */

            this.classList.add(
                "selected"
            );


            /* -----------------------------------------
               Lấy giá trị
            ----------------------------------------- */

            const value =
                Number(
                    this.dataset.rating
                );


            /* -----------------------------------------
               Lưu vào state
            ----------------------------------------- */

            journalState.rating =
                value;


            console.log(
                "Mức độ hài lòng:",
                journalState.rating
            );

        }
    );

});

/* =========================================================
   3.7 - CHỌN MỤC TIÊU
========================================================= */


/* =========================================================
   01. LẤY CÁC CHECKBOX MỤC TIÊU
========================================================= */

const goalInputs =
    document.querySelectorAll(
        'input[name="goal"]'
    );


/* =========================================================
   02. HÀM CẬP NHẬT MỤC TIÊU
========================================================= */

function updateSelectedGoals() {

    journalState.goals =
        Array.from(goalInputs)
            .filter(input => input.checked)
            .map(input => input.value);


    console.log(
        "Mục tiêu đã chọn:",
        journalState.goals
    );
}


/* =========================================================
   03. KHI HỌC SINH TICK MỤC TIÊU
========================================================= */

goalInputs.forEach(input => {

    input.addEventListener(
        "change",
        updateSelectedGoals
    );

});

/* =========================================================
   3.8 - TẠO OBJECT NHẬT KÝ
========================================================= */


/* =========================================================
   01. HÀM THU THẬP TOÀN BỘ FORM
========================================================= */

function collectAllJournalData() {

    /*
     * Thu thập lại lần cuối trước khi lưu.
     * Điều này giúp tránh trường hợp học sinh
     * vừa sửa một ô nhưng state chưa cập nhật.
     */

    collectJournalStepData(1);
    collectJournalStepData(2);
    collectJournalStepData(3);
    collectJournalStepData(4);
    collectJournalStepData(5);


    /* Cập nhật mục tiêu */

    updateSelectedGoals();


    return {

        /* -----------------------------------------
           THÔNG TIN CƠ BẢN
        ----------------------------------------- */

        id:
            createId("journal"),

        studentId:
            currentStudent.id,

        studentName:
            currentStudent.name,

        className:
            currentStudent.className,

date: new Date().toISOString(),


        /* -----------------------------------------
           BƯỚC 1 - TÌNH HUỐNG
        ----------------------------------------- */

        situation:
            journalState.situation || "",


        /* -----------------------------------------
           BƯỚC 2 - CẢM XÚC
        ----------------------------------------- */

        emotion:
            journalState.emotion || "",

        emotionReason:
            journalState.emotionReason || "",


        /* -----------------------------------------
           BƯỚC 3 - 3S
        ----------------------------------------- */

        stop:
            [...journalState.stop],

        think:
            journalState.think || "",

        select:
            journalState.select || "",


        /* -----------------------------------------
           BƯỚC 4 - KẾT QUẢ
        ----------------------------------------- */

        result:
            journalState.result || "",

        rating:
            journalState.rating || 0,

        doDifferent:
            journalState.doDifferent || "",


        /* -----------------------------------------
           BƯỚC 5 - BÀI HỌC
        ----------------------------------------- */

        lesson:
            journalState.lesson || "",

        goals:
            [...journalState.goals],


        /* -----------------------------------------
           PHẢN HỒI GIÁO VIÊN
           Ban đầu chưa có
        ----------------------------------------- */

        feedback:
            null

    };
}


/* =========================================================
   02. KIỂM TRA OBJECT
========================================================= */

function previewJournalData() {

    const journal =
        collectAllJournalData();


    console.log(
        "Journal mới:",
        journal
    );


    return journal;
}

/* =========================================================
   3.9 - LƯU NHẬT KÝ
========================================================= */


/* =========================================================
   01. HÀM LƯU MỘT NHẬT KÝ
========================================================= */

function saveNewJournal() {

    /* -----------------------------------------
       Kiểm tra bước cuối
    ----------------------------------------- */

    if (
        !validateJournalStep(5)
    ) {

        return;

    }


    /* -----------------------------------------
       Thu thập toàn bộ dữ liệu
    ----------------------------------------- */

    const newJournal =
        collectAllJournalData();


    /* -----------------------------------------
       Thêm journal mới vào đầu danh sách
    ----------------------------------------- */

    journals.unshift(
        newJournal
    );


    /* -----------------------------------------
       Lưu vào localStorage
    ----------------------------------------- */

    saveJournals();


    /* -----------------------------------------
       Thông báo
    ----------------------------------------- */

    showToast(
        "Nhật ký đã được lưu thành công!"
    );


    /* -----------------------------------------
       Reset form
    ----------------------------------------- */

    resetJournalForm();


    /* -----------------------------------------
       Quay về Dashboard
    ----------------------------------------- */

    navigateTo(
        "dashboard"
    );


    /* -----------------------------------------
       Cập nhật Dashboard
    ----------------------------------------- */

    if (
        typeof renderDashboard === "function"
    ) {

        renderDashboard();

    }

}


/* =========================================================
   02. RESET FORM
========================================================= */

function resetJournalForm() {

    /* -----------------------------------------
       Reset HTML form
    ----------------------------------------- */

    const form =
        document.querySelector(
            ".journal-form"
        );


    if (form) {

        form.reset();

    }


    /* -----------------------------------------
       Reset emotion
    ----------------------------------------- */

    document
        .querySelectorAll(".emotion-item")
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    /* -----------------------------------------
       Reset rating
    ----------------------------------------- */

    document
        .querySelectorAll(".rating button")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    /* -----------------------------------------
       Reset state
    ----------------------------------------- */

    journalState.currentStep = 1;

    journalState.situation = "";

    journalState.emotion = "";

    journalState.emotionReason = "";

    journalState.rating = 0;

    journalState.stop = [];

    journalState.think = "";

    journalState.select = "";

    journalState.result = "";

    journalState.doDifferent = "";

    journalState.lesson = "";

    journalState.goals = [];


    /* -----------------------------------------
       Quay về bước 1
    ----------------------------------------- */

    showJournalStep(1);

}


/* =========================================================
   03. TÌM NÚT HOÀN THÀNH
========================================================= */

const finishJournalButtons =
    document.querySelectorAll(
        ".finish-journal-btn"
    );


/* =========================================================
   04. CLICK HOÀN THÀNH
========================================================= */

finishJournalButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            saveNewJournal();

        }
    );

});

/* =========================================================
   3.10 - DASHBOARD
   Render thống kê + nhật ký gần đây
========================================================= */


/* =========================================================
   01. LẤY NHẬT KÝ CỦA HỌC SINH HIỆN TẠI
========================================================= */

function getStudentJournals() {

    return journals.filter(
        journal =>
            journal.studentId === currentStudent.id
    );

}


/* =========================================================
   02. ĐẾM SỐ NGÀY HOẠT ĐỘNG
========================================================= */

function getActiveDays(studentJournals) {

    const dates = studentJournals
        .map(journal => journal.date)
        .filter(Boolean);

    return new Set(dates).size;

}


/* =========================================================
   03. TÍNH TỶ LỆ HOÀN THÀNH 3S
========================================================= */

function getThreeSRate(studentJournals) {

    if (studentJournals.length === 0) {

        return 0;

    }


    const completed =
        studentJournals.filter(journal => {

            return (
                journal.stop &&
                journal.stop.length > 0 &&
                journal.think &&
                journal.select
            );

        }).length;


    return Math.round(
        (completed / studentJournals.length) * 100
    );

}


/* =========================================================
   04. FORMAT NGÀY
========================================================= */

function formatJournalDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Chưa có ngày";
    }

    return date.toLocaleDateString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


/* =========================================================
   05. ESCAPE HTML
   Tránh đưa dữ liệu nhập vào HTML
   một cách không an toàn.
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   06. RENDER STATISTICS
========================================================= */

function renderDashboardStats() {

    const studentJournals =
        getStudentJournals();


    const total =
        studentJournals.length;


    const threeSRate =
        getThreeSRate(studentJournals);


    const activeDays =
        getActiveDays(studentJournals);


    /*
     * Tìm các stat card trên Dashboard.
     * Nếu HTML có class/id khác thì chỉnh selector
     * tại đây, không cần sửa toàn bộ logic.
     */

    const statNumbers =
        document.querySelectorAll(
            ".stat-number"
        );


    if (statNumbers.length >= 3) {

        statNumbers[0].textContent =
            total;

        statNumbers[1].textContent =
            `${threeSRate}%`;

        statNumbers[2].textContent =
            activeDays;

    }

}


/* =========================================================
   07. TẠO HTML CHO MỘT NHẬT KÝ
========================================================= */

function createRecentJournalHTML(journal) {

    const situation =
        escapeHTML(
            journal.situation ||
            "Chưa có nội dung"
        );


    const emotion =
        escapeHTML(
            journal.emotion ||
            "Chưa chọn"
        );


    const date =
        escapeHTML(
            formatJournalDate(
                journal.date
            )
        );


    const threeSCompleted =
        journal.stop?.length > 0 &&
        journal.think &&
        journal.select;


    const statusText =
        threeSCompleted
            ? "✓ Đã sử dụng 3S"
            : "△ Chưa hoàn thành";


    return `
        <article
            class="recent-card"
            data-journal-id="${escapeHTML(journal.id)}">

            <div class="recent-icon">
                📝
            </div>


            <div class="recent-content">

                <h3>
                    Nhật ký tự kiểm soát
                </h3>

                <p>
                    ${situation}
                </p>


                <div class="recent-meta">

                    <span>
                        📅 ${date}
                    </span>

                    <span>
                        💭 ${emotion}
                    </span>

                    <span class="status">
                        ${statusText}
                    </span>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   08. RENDER NHẬT KÝ GẦN ĐÂY
========================================================= */

function renderRecentJournals() {

    const container =
        document.querySelector(
            ".recent-list"
        );


    if (!container) {

        return;

    }


    const studentJournals =
        getStudentJournals();


    /*
     * Lấy tối đa 5 nhật ký mới nhất.
     */

    const recentJournals =
        studentJournals.slice(0, 5);


    if (recentJournals.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    📝
                </div>

                <h3>
                    Chưa có nhật ký
                </h3>

                <p>
                    Hãy bắt đầu ghi lại
                    một tình huống hôm nay nhé.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        recentJournals
            .map(createRecentJournalHTML)
            .join("");


    /*
     * Cho phép bấm vào một nhật ký
     * để xem chi tiết.
     */

    container
        .querySelectorAll(
            ".recent-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const journalId =
                        card.dataset.journalId;


                    openJournalModal(
                        journalId
                    );

                }
            );

        });

}


/* =========================================================
   09. RENDER TOÀN BỘ DASHBOARD
========================================================= */

function renderDashboard() {

    renderDashboardStats();

    renderRecentJournals();

}


/* =========================================================
   10. TỰ ĐỘNG CẬP NHẬT SAU KHI LƯU
========================================================= */

const oldSaveNewJournal =
    saveNewJournal;


saveNewJournal = function () {

    oldSaveNewJournal();


    /*
     * Sau khi lưu xong,
     * render lại Dashboard.
     */

    renderDashboard();

};


/* =========================================================
   11. KHỞI TẠO DASHBOARD
========================================================= */

renderDashboard();

/* =========================================================
   3.11 - REVIEW: NHẬT KÝ CỦA TÔI
========================================================= */


/* =========================================================
   01. TẠO HTML CHO MỘT NHẬT KÝ
========================================================= */

function createHistoryJournalHTML(journal) {

    const situation =
        escapeHTML(
            journal.situation ||
            "Chưa có nội dung"
        );


    const emotion =
        escapeHTML(
            journal.emotion ||
            "Chưa chọn"
        );


    const date =
        escapeHTML(
            journal.date ||
            ""
        );


    const rating =
        journal.rating || 0;


    const hasFeedback =
        journal.feedback !== null &&
        journal.feedback?.content;


    const feedbackStatus =
        hasFeedback
            ? "💬 Đã có phản hồi"
            : "○ Chưa có phản hồi";


    return `
        <article
            class="journal-history-card"
            data-journal-id="${escapeHTML(journal.id)}">

            <div class="history-date">

                <strong>
                    ${date.split("/")[0] || "--"}
                </strong>

                <span>
                    THÁNG
                </span>

            </div>


            <div class="history-info">

                <h3>
                    Nhật ký tự kiểm soát
                </h3>

                <p>
                    ${situation}
                </p>


                <div class="history-meta">

                    <span>
                        💭 ${emotion}
                    </span>

                    <span>
                        ⭐ ${rating}/5
                    </span>

                    <span>
                        ${feedbackStatus}
                    </span>

                </div>

            </div>


            <button
                class="view-btn"
                data-view-journal="${escapeHTML(journal.id)}">

                Xem →

            </button>

        </article>
    `;
}


/* =========================================================
   02. RENDER DANH SÁCH NHẬT KÝ
========================================================= */

function renderJournalHistory() {

    /*
     * Tìm container của tab
     */

    const container =
        document.querySelector(
            "#review-journals .journal-history-list"
        );


    if (!container) {

        return;

    }


    /*
     * Chỉ lấy nhật ký của học sinh
     * đang đăng nhập.
     */

    const studentJournals =
        getStudentJournals();


    /* -----------------------------------------
       Không có dữ liệu
    ----------------------------------------- */

    if (studentJournals.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    📝
                </div>

                <h3>
                    Chưa có nhật ký
                </h3>

                <p>
                    Những nhật ký em hoàn thành
                    sẽ xuất hiện ở đây.
                </p>

            </div>
        `;

        return;

    }


    /* -----------------------------------------
       Render
    ----------------------------------------- */

    container.innerHTML =
        studentJournals
            .map(
                createHistoryJournalHTML
            )
            .join("");


    /* -----------------------------------------
       Gắn sự kiện xem chi tiết
    ----------------------------------------- */

    container
        .querySelectorAll(
            "[data-view-journal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    /*
                     * Không cho click xuyên
                     * xuống card.
                     */

                    event.stopPropagation();


                    const journalId =
                        button.dataset.viewJournal;


                    openJournalModal(
                        journalId
                    );

                }
            );

        });


    /* -----------------------------------------
       Click cả card cũng xem
    ----------------------------------------- */

    container
        .querySelectorAll(
            ".journal-history-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const journalId =
                        card.dataset.journalId;


                    openJournalModal(
                        journalId
                    );

                }
            );

        });

}


/* =========================================================
   03. TÌM MỘT NHẬT KÝ THEO ID
========================================================= */

function findJournalById(journalId) {

    return journals.find(
        journal =>
            journal.id === journalId
    );

}


/* =========================================================
   04. CẬP NHẬT REVIEW KHI MỞ TRANG
========================================================= */

function renderReviewPage() {

    renderJournalHistory();

}


/* =========================================================
   05. TỰ ĐỘNG RENDER KHI CHUYỂN SANG REVIEW
========================================================= */

const originalNavigateTo =
    navigateTo;


navigateTo = function(pageId) {

    originalNavigateTo(pageId);


    if (pageId === "review") {

        renderReviewPage();

    }

};

/* =========================================================
   3.12 - REVIEW: TIẾN BỘ
========================================================= */


/* =========================================================
   01. TÍNH THỐNG KÊ TIẾN BỘ
========================================================= */

function calculateProgress() {

    const studentJournals =
        getStudentJournals();


    const totalJournals =
        studentJournals.length;


    /* -----------------------------------------
       Số nhật ký đã sử dụng 3S
    ----------------------------------------- */

    const threeSUsed =
        studentJournals.filter(journal => {

            return (
                journal.stop?.length > 0 &&
                journal.think &&
                journal.select
            );

        }).length;


    /* -----------------------------------------
       Tỷ lệ sử dụng 3S
    ----------------------------------------- */

    const threeSPercentage =
        totalJournals > 0
            ? Math.round(
                (threeSUsed / totalJournals) * 100
            )
            : 0;


    /* -----------------------------------------
       Số mục tiêu đã đặt
    ----------------------------------------- */

    const totalGoals =
        studentJournals.reduce(
            (total, journal) => {

                return total +
                    (journal.goals?.length || 0);

            },
            0
        );


    /* -----------------------------------------
       Số nhật ký có phản hồi
    ----------------------------------------- */

    const feedbackCount =
        studentJournals.filter(
            journal =>
                journal.feedback &&
                journal.feedback.content
        ).length;


    return {

        totalJournals,

        threeSUsed,

        threeSPercentage,

        totalGoals,

        feedbackCount

    };

}


/* =========================================================
   02. RENDER 4 CARD THỐNG KÊ
========================================================= */

function renderProgressStats() {

    const stats =
        calculateProgress();


    const cards =
        document.querySelectorAll(
            ".progress-card"
        );


    if (cards.length < 4) {

        return;

    }


    /* Nhật ký */

    const journalNumber =
        cards[0].querySelector("strong");

    if (journalNumber) {

        journalNumber.textContent =
            stats.totalJournals;

    }


    /* Sử dụng 3S */

    const threeSNumber =
        cards[1].querySelector("strong");

    if (threeSNumber) {

        threeSNumber.textContent =
            stats.threeSUsed;

    }


    /* Mục tiêu */

    const goalNumber =
        cards[2].querySelector("strong");

    if (goalNumber) {

        goalNumber.textContent =
            stats.totalGoals;

    }


    /* Feedback */

    const feedbackNumber =
        cards[3].querySelector("strong");

    if (feedbackNumber) {

        feedbackNumber.textContent =
            stats.feedbackCount;

    }

}


/* =========================================================
   03. TẠO THANH TIẾN BỘ
========================================================= */

function createProgressRow(
    label,
    percentage
) {

    const safePercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(percentage) || 0
            )
        );


    return `
        <div class="progress-row">

            <span>
                ${escapeHTML(label)}
            </span>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${safePercentage}%">
                </div>

            </div>

            <strong>
                ${safePercentage}%
            </strong>

        </div>
    `;

}


/* =========================================================
   04. TÍNH TIẾN BỘ THEO CÁC TIÊU CHÍ
========================================================= */

function calculateProgressRows() {

    const stats =
        calculateProgress();


    return [

        {
            label: "3S",
            percentage:
                stats.threeSPercentage
        },

        {
            label: "Mục tiêu",
            percentage:
                stats.totalJournals > 0
                    ? Math.min(
                        100,
                        Math.round(
                            (
                                stats.totalGoals /
                                stats.totalJournals
                            ) * 100
                        )
                    )
                    : 0
        },

        {
            label: "Phản hồi",
            percentage:
                stats.totalJournals > 0
                    ? Math.round(
                        (
                            stats.feedbackCount /
                            stats.totalJournals
                        ) * 100
                    )
                    : 0
        }

    ];

}


/* =========================================================
   05. RENDER PROGRESS CHART
========================================================= */

function renderProgressChart() {

    const container =
        document.querySelector(
            ".progress-chart"
        );


    if (!container) {

        return;

    }


    const rows =
        calculateProgressRows();


    container.innerHTML =
        rows
            .map(row =>
                createProgressRow(
                    row.label,
                    row.percentage
                )
            )
            .join("");

}


/* =========================================================
   06. RENDER TOÀN BỘ TAB TIẾN BỘ
========================================================= */

function renderProgressPage() {

    renderProgressStats();

    renderProgressChart();

}


/* =========================================================
   07. CẬP NHẬT KHI MỞ TAB TIẾN BỘ
========================================================= */

document
    .querySelectorAll(".review-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                if (
                    target === "progress"
                ) {

                    renderProgressPage();

                }

            }
        );

    });


/* =========================================================
   08. RENDER LẦN ĐẦU
========================================================= */

renderProgressPage();

/* =========================================================
   3.13 - PHẢN HỒI GIÁO VIÊN
========================================================= */


/* =========================================================
   01. LẤY CÁC NHẬT KÝ ĐÃ CÓ PHẢN HỒI
========================================================= */

function getFeedbackJournals() {

    return getStudentJournals().filter(journal => {

        return (
            journal.feedback &&
            journal.feedback.content &&
            journal.feedback.content.trim()
        );

    });

}


/* =========================================================
   02. TẠO HTML CHO MỘT FEEDBACK CARD
========================================================= */

function createFeedbackHTML(journal) {

    const feedback =
        journal.feedback;


    const teacherName =
        escapeHTML(
            feedback.teacherName ||
            "Giáo viên"
        );


    const date =
        escapeHTML(
            feedback.date ||
            journal.date ||
            ""
        );


    const content =
        escapeHTML(
            feedback.content ||
            ""
        );


    return `
        <article class="feedback-card">

            <div class="feedback-header">

                <div class="teacher-avatar">
                    GV
                </div>

                <div>

                    <h3>
                        ${teacherName}
                    </h3>

                    <span>
                        ${date}
                    </span>

                </div>

            </div>


            <div class="feedback-content">

                <p>
                    ${content}
                </p>

            </div>


            <div class="feedback-journal">

                <small>
                    Phản hồi cho nhật ký:
                </small>

                <strong>
                    ${escapeHTML(
                        journal.situation ||
                        "Nhật ký tự kiểm soát"
                    )}
                </strong>

            </div>

        </article>
    `;
}


/* =========================================================
   03. RENDER DANH SÁCH PHẢN HỒI
========================================================= */

function renderTeacherFeedback() {

    /*
     * Container trong tab feedback.
     *
     * Nếu HTML đang dùng class khác,
     * chỉ cần đổi selector này.
     */

    const container =
        document.querySelector(
            "#review-feedback .feedback-list"
        );


    if (!container) {

        return;

    }


    const feedbackJournals =
        getFeedbackJournals();


    /* -----------------------------------------
       Chưa có phản hồi
    ----------------------------------------- */

    if (feedbackJournals.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    💬
                </div>

                <h3>
                    Chưa có phản hồi
                </h3>

                <p>
                    Khi giáo viên gửi nhận xét,
                    phản hồi sẽ xuất hiện ở đây.
                </p>

            </div>
        `;

        return;

    }


    /* -----------------------------------------
       Có feedback
    ----------------------------------------- */

    container.innerHTML =
        feedbackJournals
            .map(
                createFeedbackHTML
            )
            .join("");

}


/* =========================================================
   04. CẬP NHẬT TAB FEEDBACK
========================================================= */

function renderFeedbackPage() {

    renderTeacherFeedback();

}


/* =========================================================
   05. KHI BẤM TAB "PHẢN HỒI"
========================================================= */

document
    .querySelectorAll(".review-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                if (
                    target === "feedback"
                ) {

                    renderFeedbackPage();

                }

            }
        );

    });


/* =========================================================
   06. CẬP NHẬT FEEDBACK KHI VỪA MỞ REVIEW
========================================================= */

const previousRenderReviewPage =
    renderReviewPage;


renderReviewPage = function () {

    previousRenderReviewPage();

    renderTeacherFeedback();

};

/* =========================================================
   3.14 - GIAO DIỆN GIÁO VIÊN
========================================================= */


/* =========================================================
   01. LẤY DANH SÁCH HỌC SINH
========================================================= */

function getStudents() {

    const students = [];


    journals.forEach(journal => {

        const exists =
            students.some(
                student =>
                    student.id === journal.studentId
            );


        if (!exists) {

            students.push({

                id:
                    journal.studentId,

                name:
                    journal.studentName ||
                    "Học sinh",

                className:
                    journal.className ||
                    "",

                journals: 0,

                feedback: 0

            });

        }

    });


    /*
     * Đếm số nhật ký + feedback
     */

    students.forEach(student => {

        const studentJournals =
            journals.filter(
                journal =>
                    journal.studentId === student.id
            );


        student.journals =
            studentJournals.length;


        student.feedback =
            studentJournals.filter(
                journal =>
                    journal.feedback &&
                    journal.feedback.content
            ).length;

    });


    return students;

}


/* =========================================================
   02. THỐNG KÊ GIÁO VIÊN
========================================================= */

function calculateTeacherStats() {

    const students =
        getStudents();


    const totalStudents =
        students.length;


    const totalJournals =
        journals.length;


    const needFeedback =
        journals.filter(journal => {

            return !(
                journal.feedback &&
                journal.feedback.content
            );

        }).length;


    const feedbackDone =
        journals.filter(journal => {

            return (
                journal.feedback &&
                journal.feedback.content
            );

        }).length;


    return {

        totalStudents,

        totalJournals,

        needFeedback,

        feedbackDone

    };

}


/* =========================================================
   03. RENDER STATISTICS GIÁO VIÊN
========================================================= */

function renderTeacherStats() {

    const stats =
        calculateTeacherStats();


    const cards =
        document.querySelectorAll(
            ".teacher-stat-card"
        );


    if (cards.length < 3) {

        return;

    }


    const values = [

        stats.totalStudents,

        stats.totalJournals,

        stats.needFeedback

    ];


    cards.forEach((card, index) => {

        const number =
            card.querySelector("strong");


        if (number) {

            number.textContent =
                values[index];

        }

    });

}


/* =========================================================
   04. TẠO CARD HỌC SINH
========================================================= */

function createTeacherStudentHTML(student) {

    const initials =
        student.name
            .trim()
            .split(/\s+/)
            .map(
                word =>
                    word[0]
            )
            .slice(-2)
            .join("")
            .toUpperCase();


    return `
        <article
            class="teacher-student-card"
            data-student-id="${escapeHTML(student.id)}">

            <div class="student-info">

                <div class="student-avatar">
                    ${escapeHTML(initials)}
                </div>

                <div>

                    <h3>
                        ${escapeHTML(student.name)}
                    </h3>

                    <span>
                        Lớp ${escapeHTML(
                            student.className
                        )}
                    </span>

                </div>

            </div>


            <div class="student-journal-count">

                <strong>
                    ${student.journals}
                </strong>

                <span>
                    nhật ký
                </span>

            </div>


            <div class="student-feedback-count">

                <strong>
                    ${student.feedback}
                </strong>

                <span>
                    phản hồi
                </span>

            </div>


            <button
                class="teacher-view-btn"
                data-teacher-student="${escapeHTML(
                    student.id
                )}">

                Xem →

            </button>

        </article>
    `;
}


/* =========================================================
   05. RENDER DANH SÁCH HỌC SINH
========================================================= */

function renderTeacherStudents() {

    const container =
        document.querySelector(
            ".teacher-student-list"
        );


    if (!container) {

        return;

    }


    const students =
        getStudents();


    if (students.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    👥
                </div>

                <h3>
                    Chưa có dữ liệu học sinh
                </h3>

                <p>
                    Danh sách sẽ xuất hiện
                    khi học sinh hoàn thành nhật ký.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        students
            .map(
                createTeacherStudentHTML
            )
            .join("");


    /*
     * Nút xem học sinh
     */

    container
        .querySelectorAll(
            "[data-teacher-student]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const studentId =
                        button.dataset
                            .teacherStudent;


                    showTeacherStudent(
                        studentId
                    );

                }
            );

        });

}


/* =========================================================
   06. NHẬT KÝ GẦN ĐÂY CHO GIÁO VIÊN
========================================================= */

function renderTeacherRecentJournals() {

    const container =
        document.querySelector(
            ".teacher-journal-list"
        );


    if (!container) {

        return;

    }


    /*
     * Lấy tối đa 10 nhật ký mới nhất.
     */

    const recent =
        journals.slice(0, 10);


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    📝
                </div>

                <h3>
                    Chưa có nhật ký mới
                </h3>

                <p>
                    Nhật ký của học sinh
                    sẽ xuất hiện tại đây.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        recent
            .map(journal => {

                const studentName =
                    escapeHTML(
                        journal.studentName ||
                        "Học sinh"
                    );


                const className =
                    escapeHTML(
                        journal.className ||
                        ""
                    );


                const situation =
                    escapeHTML(
                        journal.situation ||
                        "Chưa có tình huống"
                    );


                const hasFeedback =
                    journal.feedback &&
                    journal.feedback.content;


                return `
                    <article
                        class="teacher-journal-card"
                        data-journal-id="${escapeHTML(
                            journal.id
                        )}">

                        <div class="student-info">

                            <div class="student-avatar">
                                HS
                            </div>

                            <div>

                                <h3>
                                    ${studentName}
                                </h3>

                                <span>
                                    Lớp ${className}
                                </span>

                            </div>

                        </div>


                        <div class="situation-info">

                            <span>
                                Tình huống
                            </span>

                            <strong>
                                ${situation}
                            </strong>

                        </div>


                        <div class="three-s-status">

                            <span>
                                Trạng thái
                            </span>

                            <strong
                                class="${
                                    hasFeedback
                                        ? "complete"
                                        : "incomplete"
                                }">

                                ${
                                    hasFeedback
                                        ? "✓ Đã phản hồi"
                                        : "△ Chưa phản hồi"
                                }

                            </strong>

                        </div>


                        <button
                            class="teacher-view-btn"
                            data-teacher-journal="${escapeHTML(
                                journal.id
                            )}">

                            Xem →

                        </button>

                    </article>
                `;

            })
            .join("");


    /*
     * Click Xem
     */

    container
        .querySelectorAll(
            "[data-teacher-journal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const journalId =
                        button.dataset
                            .teacherJournal;


                    openTeacherJournal(
                        journalId
                    );

                }
            );

        });

}


/* =========================================================
   07. RENDER TOÀN BỘ TEACHER DASHBOARD
========================================================= */

function renderTeacherDashboard() {

    renderTeacherStats();

    renderTeacherStudents();

    renderTeacherRecentJournals();

}


/* =========================================================
   08. CHUYỂN SANG GIAO DIỆN GIÁO VIÊN
========================================================= */

function showTeacherDashboard() {

    navigateTo("teacher");

    renderTeacherDashboard();

}


/* =========================================================
   09. TỰ RENDER KHI MỞ PAGE TEACHER
========================================================= */

const previousNavigateForTeacher =
    navigateTo;


navigateTo = function(pageId) {

    previousNavigateForTeacher(
        pageId
    );


    if (pageId === "teacher") {

        renderTeacherDashboard();

    }

};

/* =========================================================
   3.15 - GIÁO VIÊN XEM CHI TIẾT NHẬT KÝ
========================================================= */


/* =========================================================
   01. LẤY NHẬT KÝ CỦA MỘT HỌC SINH
========================================================= */

function getStudentJournalsById(studentId) {

    return journals.filter(
        journal =>
            journal.studentId === studentId
    );

}


/* =========================================================
   02. LẤY THÔNG TIN HỌC SINH
========================================================= */

function getStudentById(studentId) {

    return getStudents().find(
        student =>
            student.id === studentId
    );

}


/* =========================================================
   03. HIỂN THỊ CHI TIẾT HỌC SINH
========================================================= */

function showTeacherStudent(studentId) {

    const student =
        getStudentById(studentId);


    if (!student) {

        showToast(
            "Không tìm thấy học sinh."
        );

        return;

    }


    const studentJournals =
        getStudentJournalsById(
            studentId
        );


    /*
     * Lưu học sinh đang được giáo viên xem.
     */

    window.currentTeacherStudentId =
        studentId;


    /*
     * Tìm khu vực detail.
     */

    const detail =
        document.querySelector(
            ".teacher-student-detail"
        );


    if (!detail) {

        /*
         * Nếu HTML chưa có khu vực riêng,
         * dùng modal.
         */

        openTeacherStudentModal(
            student,
            studentJournals
        );

        return;

    }


    /* -----------------------------------------
       Render thông tin học sinh
    ----------------------------------------- */

    detail.innerHTML = `

        <div class="modal-header">

            <div>

                <h2>
                    ${escapeHTML(student.name)}
                </h2>

                <p>
                    Lớp ${escapeHTML(
                        student.className
                    )}
                </p>

            </div>

            <button
                class="modal-close"
                data-close-teacher-detail>

                ×

            </button>

        </div>


        <div class="teacher-student-summary">

            <div class="teacher-stat-card">

                <div class="teacher-stat-icon">
                    📝
                </div>

                <div>

                    <strong>
                        ${studentJournals.length}
                    </strong>

                    <span>
                        Nhật ký
                    </span>

                </div>

            </div>


            <div class="teacher-stat-card">

                <div class="teacher-stat-icon">
                    💬
                </div>

                <div>

                    <strong>
                        ${
                            studentJournals.filter(
                                journal =>
                                    journal.feedback
                            ).length
                        }
                    </strong>

                    <span>
                        Phản hồi
                    </span>

                </div>

            </div>

        </div>


        <div class="teacher-student-journals">

            <h3>
                Nhật ký của học sinh
            </h3>

            <div class="teacher-detail-list">
            </div>

        </div>
    `;


    const list =
        detail.querySelector(
            ".teacher-detail-list"
        );


    if (
        studentJournals.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📝
                </div>

                <h3>
                    Chưa có nhật ký
                </h3>

                <p>
                    Học sinh chưa hoàn thành
                    nhật ký nào.
                </p>

            </div>

        `;

    } else {

        list.innerHTML =
            studentJournals
                .map(
                    createTeacherJournalDetailHTML
                )
                .join("");


        attachTeacherJournalEvents(
            list
        );

    }


    /*
     * Nút đóng
     */

    const closeButton =
        detail.querySelector(
            "[data-close-teacher-detail]"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                detail.innerHTML = "";

                detail.classList.remove(
                    "active"
                );

            }
        );

    }


    detail.classList.add(
        "active"
    );

}


/* =========================================================
   04. TẠO CARD NHẬT KÝ CHO GIÁO VIÊN
========================================================= */

function createTeacherJournalDetailHTML(
    journal
) {

    const emotion =
        escapeHTML(
            journal.emotion ||
            "Chưa chọn"
        );


    const situation =
        escapeHTML(
            journal.situation ||
            "Chưa có tình huống"
        );


    const date =
        escapeHTML(
            journal.date ||
            ""
        );


    const feedback =
        journal.feedback &&
        journal.feedback.content;


    return `

        <article
            class="teacher-journal-detail-card"
            data-journal-id="${escapeHTML(
                journal.id
            )}">

            <div>

                <span class="journal-date">
                    ${date}
                </span>


                <h3>
                    ${situation}
                </h3>


                <div class="history-meta">

                    <span>
                        💭 ${emotion}
                    </span>


                    <span>
                        ⭐ ${journal.rating || 0}/5
                    </span>


                    <span
                        class="${
                            feedback
                                ? "complete"
                                : "incomplete"
                        }">

                        ${
                            feedback
                                ? "✓ Đã phản hồi"
                                : "△ Chưa phản hồi"
                        }

                    </span>

                </div>

            </div>


            <button
                class="teacher-view-btn"
                data-open-teacher-journal="${escapeHTML(
                    journal.id
                )}">

                Xem chi tiết →

            </button>

        </article>

    `;
}


/* =========================================================
   05. GẮN EVENT CHO CÁC NHẬT KÝ
========================================================= */

function attachTeacherJournalEvents(
    container
) {

    container
        .querySelectorAll(
            "[data-open-teacher-journal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const journalId =
                        button.dataset
                            .openTeacherJournal;


                    openTeacherJournal(
                        journalId
                    );

                }
            );

        });

}


/* =========================================================
   06. MỞ CHI TIẾT MỘT NHẬT KÝ
========================================================= */

function openTeacherJournal(
    journalId
) {

    const journal =
        findJournalById(
            journalId
        );


    if (!journal) {

        showToast(
            "Không tìm thấy nhật ký."
        );

        return;

    }


    const modal =
        document.querySelector(
            "#teacher-journal-modal"
        );


    if (!modal) {

        openTeacherJournalFallback(
            journal
        );

        return;

    }


    renderTeacherJournalModal(
        modal,
        journal
    );


    modal.classList.add(
        "active"
    );

}


/* =========================================================
   07. RENDER MODAL CHI TIẾT
========================================================= */

function renderTeacherJournalModal(
    modal,
    journal
) {

    const studentName =
        escapeHTML(
            journal.studentName ||
            "Học sinh"
        );


    const situation =
        escapeHTML(
            journal.situation ||
            "Chưa có"
        );


    const emotion =
        escapeHTML(
            journal.emotion ||
            "Chưa chọn"
        );


    const emotionReason =
        escapeHTML(
            journal.emotionReason ||
            "Chưa có"
        );


    const stop =
        journal.stop?.length
            ? journal.stop
                .map(
                    item =>
                        `<li>${escapeHTML(item)}</li>`
                )
                .join("")
            : "<li>Chưa có dữ liệu</li>";


    const think =
        escapeHTML(
            journal.think ||
            "Chưa có"
        );


    const select =
        escapeHTML(
            journal.select ||
            "Chưa có"
        );


    const result =
        escapeHTML(
            journal.result ||
            "Chưa có"
        );


    const lesson =
        escapeHTML(
            journal.lesson ||
            "Chưa có"
        );


    const goals =
        journal.goals?.length
            ? journal.goals
                .map(
                    goal =>
                        `<li>${escapeHTML(goal)}</li>`
                )
                .join("")
            : "<li>Chưa đặt mục tiêu</li>";


    modal.innerHTML = `

        <div class="modal">

            <div class="modal-header">

                <div>

                    <h2>
                        Chi tiết nhật ký
                    </h2>

                    <p>
                        ${studentName}
                        ·
                        ${escapeHTML(
                            journal.date || ""
                        )}
                    </p>

                </div>


                <button
                    class="modal-close"
                    data-close-modal>

                    ×

                </button>

            </div>


            <div class="modal-body">


                <section class="modal-section">

                    <h3>
                        📝 Tình huống
                    </h3>

                    <p>
                        ${situation}
                    </p>

                </section>


                <section class="modal-section">

                    <h3>
                        💭 Cảm xúc
                    </h3>

                    <p>
                        <strong>
                            ${emotion}
                        </strong>
                    </p>

                    <p>
                        ${emotionReason}
                    </p>

                </section>


                <section class="modal-section">

                    <h3>
                        ⭐ 3S
                    </h3>

                    <p>
                        <strong>STOP</strong>
                    </p>

                    <ul>
                        ${stop}
                    </ul>

                    <p>
                        <strong>THINK</strong>
                    </p>

                    <p>
                        ${think}
                    </p>

                    <p>
                        <strong>SELECT</strong>
                    </p>

                    <p>
                        ${select}
                    </p>

                </section>


                <section class="modal-section">

                    <h3>
                        📊 Kết quả
                    </h3>

                    <p>
                        ${result}
                    </p>

                    <p>
                        Tự đánh giá:
                        <strong>
                            ${journal.rating || 0}/5
                        </strong>
                    </p>

                </section>


                <section class="modal-section">

                    <h3>
                        💡 Bài học
                    </h3>

                    <p>
                        ${lesson}
                    </p>

                </section>


                <section class="modal-section">

                    <h3>
                        🎯 Mục tiêu
                    </h3>

                    <ul>
                        ${goals}
                    </ul>

                </section>


            </div>


            <div class="modal-footer">

                <button
                    class="secondary-btn"
                    data-close-modal>

                    Đóng

                </button>


                <button
                    class="primary-btn"
                    data-feedback-journal="${escapeHTML(
                        journal.id
                    )}">

                    ${
                        journal.feedback
                            ? "Xem / sửa phản hồi"
                            : "Viết phản hồi"
                    }

                </button>

            </div>

        </div>

    `;


    /*
     * Đóng modal
     */

    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "active"
                    );

                }
            );

        });


    /*
     * Chuyển sang phần feedback.
     * Logic lưu feedback sẽ làm ở 3.16.
     */

    const feedbackButton =
        modal.querySelector(
            "[data-feedback-journal]"
        );


    if (feedbackButton) {

        feedbackButton.addEventListener(
            "click",
            () => {

                const journalId =
                    feedbackButton.dataset
                        .feedbackJournal;


                openTeacherFeedback(
                    journalId
                );

            }
        );

    }

}

/* =========================================================
   E1 — GỬI / LƯU PHẢN HỒI GIÁO VIÊN
========================================================= */

function openTeacherFeedback(journalId) {

    const journal =
        findJournalById(journalId);

    if (!journal) {
        showToast("Không tìm thấy nhật ký.");
        return;
    }

    const currentFeedback =
        journal.feedback &&
        typeof journal.feedback === "object"
            ? journal.feedback.content || ""
            : "";

    const teacherName =
        "Cô Nguyễn Thị A";

    const feedback =
        window.prompt(
            "Nhập phản hồi dành cho học sinh:",
            currentFeedback
        );

    /* Người dùng bấm Hủy */
    if (feedback === null) {
        return;
    }

    const content =
        feedback.trim();

    /* Không cho gửi phản hồi rỗng */
    if (!content) {
        showToast(
            "Bạn hãy nhập nội dung phản hồi."
        );
        return;
    }

    /* Tìm đúng nhật ký trong mảng hiện tại */
    const journalIndex =
        journals.findIndex(
            item =>
                String(item.id) ===
                String(journalId)
        );

    if (journalIndex === -1) {
        showToast(
            "Không tìm thấy nhật ký để lưu phản hồi."
        );
        return;
    }

    /* Lưu phản hồi */
    journals[journalIndex].feedback = {
        content: content,
        teacherName: teacherName,
        date: new Date().toISOString()
    };

    /* Ghi lại localStorage */
    saveJournals();

    /* Cập nhật lại dữ liệu đang dùng */
    journal.feedback =
        journals[journalIndex].feedback;

    /* Cập nhật giao diện */
    renderTeacherStudents();
    renderTeacherRecentJournals();

    if (
        typeof renderReviewPage ===
        "function"
    ) {
        renderReviewPage();
    }

    if (
        typeof renderTeacherFeedback ===
        "function"
    ) {
        renderTeacherFeedback();
    }

    showToast(
        "Đã gửi phản hồi cho học sinh."
    );
}

/* =========================================================
   08. FALLBACK NẾU CHƯA CÓ MODAL HTML
========================================================= */

function openTeacherJournalFallback(
    journal
) {

    /*
     * Tạm dùng alert để không làm
     * hệ thống bị lỗi nếu HTML chưa
     * có #teacher-journal-modal.
     *
     * Khi hoàn thiện HTML modal,
     * hàm này sẽ không được dùng.
     */

    alert(
        `Nhật ký của ${
            journal.studentName || "học sinh"
        }\n\n${
            journal.situation || ""
        }`
    );

}


/* =========================================================
   09. FALLBACK CHI TIẾT HỌC SINH
========================================================= */

function openTeacherStudentModal(
    student,
    studentJournals
) {

    const modal =
        document.querySelector(
            "#teacher-journal-modal"
        );


    if (!modal) {

        showToast(
            `Học sinh ${student.name} có ${studentJournals.length} nhật ký.`
        );

        return;

    }


    modal.innerHTML = `

        <div class="modal">

            <div class="modal-header">

                <div>

                    <h2>
                        ${escapeHTML(
                            student.name
                        )}
                    </h2>

                    <p>
                        Lớp ${escapeHTML(
                            student.className
                        )}
                    </p>

                </div>


                <button
                    class="modal-close"
                    data-close-modal>

                    ×

                </button>

            </div>


            <div class="modal-body">

                ${
                    studentJournals.length
                        ? studentJournals
                            .map(
                                createTeacherJournalDetailHTML
                            )
                            .join("")
                        : `
                            <div class="empty-state">
                                <h3>
                                    Chưa có nhật ký
                                </h3>
                            </div>
                        `
                }

            </div>

        </div>

    `;


    modal.classList.add(
        "active"
    );


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "active"
                    );

                }
            );

        });


    attachTeacherJournalEvents(
        modal
    );

}

/* =========================================================
   B2 — NGÀY / THÁNG / NĂM / THỨ THỰC TẾ
========================================================= */

function updateDashboardDate() {

    const dateElement =
        document.getElementById("dashboard-date");


    // Nếu đang ở trang khác hoặc phần tử chưa tồn tại
    // thì không làm gì
    if (!dateElement) {
        return;
    }


    const now = new Date();


    const weekday =
        now.toLocaleDateString(
            "vi-VN",
            {
                weekday: "long"
            }
        );


    const day =
        now.toLocaleDateString(
            "vi-VN",
            {
                day: "2-digit"
            }
        );


    const month =
        now.toLocaleDateString(
            "vi-VN",
            {
                month: "2-digit"
            }
        );


    const year =
        now.toLocaleDateString(
            "vi-VN",
            {
                year: "numeric"
            }
        );


    dateElement.textContent =
        `${weekday}, ${day}/${month}/${year}`;
}


/*
   Chạy ngay khi website mở
*/

updateDashboardDate();


/*
   Kiểm tra lại mỗi phút.
   Ví dụ 23:59 → 00:00 thì ngày
   trên Dashboard sẽ tự đổi.
*/

setInterval(
    updateDashboardDate,
    60 * 1000
);

/* =========================================================
   B3 — ĐỒNG HỒ THỜI GIAN THỰC
========================================================= */

function updateDashboardClock() {

    const clockElement =
        document.getElementById("dashboard-clock");


    if (!clockElement) {
        return;
    }


    const now = new Date();


    const hours =
        String(now.getHours())
            .padStart(2, "0");


    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");


    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");


    clockElement.textContent =
        `${hours}:${minutes}:${seconds}`;
}


/*
   Chạy ngay lập tức
*/

updateDashboardClock();


/*
   Cập nhật mỗi 1 giây
*/

setInterval(
    updateDashboardClock,
    1000
);

/* =========================================================
   B4 — KẾT NỐI DASHBOARD VỚI DỮ LIỆU NHẬT KÝ
========================================================= */


/* =========================================================
   01. ĐỌC DANH SÁCH NHẬT KÝ
========================================================= */

function getDashboardJournals() {

    try {

        const savedJournals =
            localStorage.getItem("behav_journals");


        if (!savedJournals) {

            return [];

        }


        const journals =
            JSON.parse(savedJournals);


        if (!Array.isArray(journals)) {

            return [];

        }


        return journals;

    } catch (error) {

        console.error(
            "Không thể đọc dữ liệu nhật ký:",
            error
        );

        return [];

    }

}


/* =========================================================
   02. CẬP NHẬT TỔNG SỐ NHẬT KÝ
========================================================= */

function updateDashboardJournalCount(
    journals
) {

    const totalElement =
        document.getElementById(
            "total-journals"
        );


    if (!totalElement) {

        return;

    }


    totalElement.textContent =
        journals.length;

}


/* =========================================================
   03. KIỂM TRA PHẢN HỒI
========================================================= */

function journalHasFeedback(
    journal
) {

    /*
       Hỗ trợ một vài dạng dữ liệu feedback
       để không làm hỏng nhật ký cũ.
    */

    if (!journal) {

        return false;

    }


    if (
        journal.feedback &&
        String(journal.feedback).trim() !== ""
    ) {

        return true;

    }


    if (
        journal.teacherFeedback &&
        String(journal.teacherFeedback).trim() !== ""
    ) {

        return true;

    }


    if (
        Array.isArray(journal.feedbacks) &&
        journal.feedbacks.length > 0
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   04. CẬP NHẬT SỐ PHẢN HỒI
========================================================= */

function updateDashboardFeedbackCount(
    journals
) {

    const feedbackElement =
        document.getElementById(
            "feedback-count"
        );


    const pendingElement =
        document.getElementById(
            "pending-feedback"
        );


    if (!feedbackElement ||
        !pendingElement) {

        return;

    }


    const feedbackCount =
        journals.filter(
            journalHasFeedback
        ).length;


    const pendingCount =
        Math.max(
            journals.length - feedbackCount,
            0
        );


    feedbackElement.textContent =
        feedbackCount;


    pendingElement.textContent =
        pendingCount;

}


/* =========================================================
   05. TẠO NGÀY HIỂN THỊ
========================================================= */

function getJournalDisplayDate(
    journal
) {

    if (!journal) {

        return "Chưa có ngày";

    }


    const rawDate =
        journal.date ||
        journal.createdAt ||
        journal.created_at;


    if (!rawDate) {

        return "Chưa có ngày";

    }


    const date =
        new Date(rawDate);


    if (Number.isNaN(date.getTime())) {

        return String(rawDate);

    }


    return date.toLocaleDateString(
        "vi-VN"
    );

}


/* =========================================================
   06. LẤY TIÊU ĐỀ NHẬT KÝ
========================================================= */

function getJournalDisplayTitle(
    journal
) {

    if (!journal) {

        return "Nhật ký";

    }


    return (
        journal.title ||
        journal.situation ||
        journal.event ||
        "Một ngày của tôi"
    );

}


/* =========================================================
   07. HIỂN THỊ NHẬT KÝ GẦN ĐÂY
========================================================= */

function renderRecentJournals(
    journals
) {

    const container =
        document.getElementById(
            "recent-journals"
        );


    if (!container) {

        return;

    }


    if (journals.length === 0) {

        container.innerHTML = `

            <div class="empty-journal">

                <div>
                    📖
                </div>

                <h3>
                    Chưa có nhật ký
                </h3>

                <p>
                    Hãy viết lại một điều nhỏ
                    về ngày hôm nay.
                </p>

                <button
                    class="primary-btn"
                    data-page="journal">

                    ✍️ Viết nhật ký

                </button>

            </div>

        `;


        return;

    }


    /*
       Lấy tối đa 5 nhật ký gần nhất.
    */

    const recent =
        [...journals]
            .reverse()
            .slice(0, 5);


    container.innerHTML =
        recent.map(
            (journal, index) => {

                const title =
                    getJournalDisplayTitle(
                        journal
                    );


                const date =
                    getJournalDisplayDate(
                        journal
                    );


                const hasFeedback =
                    journalHasFeedback(
                        journal
                    );


                return `

                    <div
                        class="recent-journal-item"
                        data-journal-index="${index}">

                        <div
                            class="recent-journal-icon">

                            ${
                                hasFeedback
                                    ? "💬"
                                    : "📝"
                            }

                        </div>


                        <div
                            class="recent-journal-info">

                            <strong>
                                ${escapeDashboardText(title)}
                            </strong>

                            <small>
                                ${escapeDashboardText(date)}
                            </small>

                        </div>


                        <span
                            class="
                                recent-journal-status
                                ${
                                    hasFeedback
                                        ? "has-feedback"
                                        : "waiting-feedback"
                                }
                            ">

                            ${
                                hasFeedback
                                    ? "Đã phản hồi"
                                    : "Chờ phản hồi"
                            }

                        </span>

                    </div>

                `;

            }
        ).join("");


}


/* =========================================================
   08. BẢO VỆ TEXT HIỂN THỊ
========================================================= */

function escapeDashboardText(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   09. CẬP NHẬT TOÀN BỘ DASHBOARD
========================================================= */

function updateStudentDashboard() {

    const journals =
        getDashboardJournals();


    updateDashboardJournalCount(
        journals
    );


    updateDashboardFeedbackCount(
        journals
    );


    renderRecentJournals(
        journals
    );

}


/* =========================================================
   10. CHẠY KHI WEBSITE KHỞI ĐỘNG
========================================================= */

updateStudentDashboard();


/* =========================================================
   11. CẬP NHẬT KHI LOCALSTORAGE THAY ĐỔI
========================================================= */

window.addEventListener(
    "storage",
    function () {

        updateStudentDashboard();

    }
);

/* =========================================================
   C2 — ĐIỀU KHIỂN 6 BƯỚC VIẾT NHẬT KÝ
========================================================= */


/* =========================================================
   C2.1 — BIẾN QUẢN LÝ BƯỚC HIỆN TẠI
========================================================= */

let currentJournalStep = 1;

const TOTAL_JOURNAL_STEPS = 6;


/* =========================================================
   C2.2 — HIỂN THỊ BƯỚC
========================================================= */

function showJournalStep(step) {

    if (
        step < 1 ||
        step > TOTAL_JOURNAL_STEPS
    ) {

        return;

    }


    currentJournalStep = step;


    /*
       Ẩn toàn bộ bước
    */

    const steps =
        document.querySelectorAll(
            ".journal-step"
        );


    steps.forEach(
        function (element) {

            element.classList.remove(
                "active"
            );

        }
    );


    /*
       Hiện bước hiện tại
    */

    const currentStep =
        document.querySelector(
            `.journal-step[data-journal-step="${step}"]`
        );


    if (currentStep) {

        currentStep.classList.add(
            "active"
        );

    }


    /*
       Cập nhật số bước
    */

    const stepNumber =
        document.getElementById(
            "journal-step-number"
        );


    if (stepNumber) {

        stepNumber.textContent =
            step;

    }


    /*
       Cập nhật thanh tiến trình
    */

    const progressFill =
        document.getElementById(
            "journal-progress-fill"
        );


    if (progressFill) {

        const progress =
            (step / TOTAL_JOURNAL_STEPS)
            * 100;


        progressFill.style.width =
            `${progress}%`;

    }


    /*
       Cập nhật các số bước bên dưới
    */

    const progressSteps =
        document.querySelectorAll(
            ".journal-progress-step"
        );


    progressSteps.forEach(
        function (element) {

            const stepValue =
                Number(
                    element.dataset.step
                );


            element.classList.toggle(
                "active",
                stepValue <= step
            );

        }
    );


    /*
       Nút quay lại
    */

    const backButton =
        document.getElementById(
            "journal-back"
        );


    if (backButton) {

        backButton.disabled =
            step === 1;

    }


    /*
       Nút tiếp theo
    */

    const nextButton =
        document.getElementById(
            "journal-next"
        );


    if (nextButton) {

        if (
            step === TOTAL_JOURNAL_STEPS
        ) {

            nextButton.textContent =
                "Hoàn thành ✓";

        } else {

            nextButton.textContent =
                "Tiếp theo →";

        }

    }

}





/* =========================================================
   C2.4 — NÚT QUAY LẠI
========================================================= */

function goToPreviousJournalStep() {

    if (
        currentJournalStep > 1
    ) {

        showJournalStep(
            currentJournalStep - 1
        );

    }

}


/* =========================================================
   C2.5 — GẮN SỰ KIỆN CHO NÚT
========================================================= */


const journalBackButton =
    document.getElementById(
        "journal-back"
    );


if (journalBackButton) {

    journalBackButton.addEventListener(
        "click",
        goToPreviousJournalStep
    );

}


/* =========================================================
   C2.6 — CHỌN CẢM XÚC
========================================================= */

const emotionOptions =
    document.querySelectorAll(
        ".emotion-option"
    );


emotionOptions.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                /*
                   Bỏ chọn tất cả
                */

                emotionOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                /*
                   Chọn nút hiện tại
                */

                button.classList.add(
                    "selected"
                );


                /*
                   Lưu tạm cảm xúc
                   để C3 dùng tiếp.
                */

                window.selectedJournalEmotion =
                    button.dataset.emotion;


                const saveStatus =
                    document.getElementById(
                        "journal-save-status"
                    );


                if (saveStatus) {

                    saveStatus.textContent =
                        "Đã chọn cảm xúc";

                }

            }
        );

    }
);


/* =========================================================
   C2.7 — ĐẾM KÝ TỰ
========================================================= */

function setupJournalCharacterCounter(
    inputId,
    counterId
) {

    const input =
        document.getElementById(
            inputId
        );


    const counter =
        document.getElementById(
            counterId
        );


    if (!input || !counter) {

        return;

    }


    function updateCounter() {

        counter.textContent =
            input.value.length;

    }


    input.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();

}


/* =========================================================
   C2.8 — KÍCH HOẠT CÁC BỘ ĐẾM
========================================================= */

setupJournalCharacterCounter(
    "journal-situation",
    "situation-count"
);


setupJournalCharacterCounter(
    "journal-result",
    "result-count"
);


setupJournalCharacterCounter(
    "journal-lesson",
    "lesson-count"
);


setupJournalCharacterCounter(
    "journal-goal",
    "goal-count"
);


/* =========================================================
   C2.9 — KHỞI ĐỘNG Ở BƯỚC 1
========================================================= */

showJournalStep(1);

/* =========================================================
   C3 — KIỂM TRA DỮ LIỆU NHẬT KÝ TRƯỚC KHI HOÀN THÀNH
========================================================= */


/* =========================================================
   C3.1 — LẤY GIÁ TRỊ Ô NHẬP
========================================================= */

function getJournalInputValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =========================================================
   C3.2 — KIỂM TRA BƯỚC 1
========================================================= */

function validateJournalStep1() {

    const situation =
        getJournalInputValue(
            "journal-situation"
        );


    if (!situation) {

        return {
            valid: false,
            message:
                "Bạn hãy kể lại một điều đã xảy ra hôm nay nhé."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.3 — KIỂM TRA BƯỚC 2
========================================================= */

function validateJournalStep2() {

    if (
        !window.selectedJournalEmotion
    ) {

        return {
            valid: false,
            message:
                "Bạn hãy chọn cảm xúc phù hợp với mình nhé."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.4 — KIỂM TRA BƯỚC 3
========================================================= */

function validateJournalStep3() {

    const s1 =
        getJournalInputValue(
            "journal-s1"
        );


    const s2 =
        getJournalInputValue(
            "journal-s2"
        );


    const s3 =
        getJournalInputValue(
            "journal-s3"
        );


    if (!s1 || !s2 || !s3) {

        return {
            valid: false,
            message:
                "Bạn hãy hoàn thành cả 3 phần S1, S2 và S3 nhé."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.5 — KIỂM TRA BƯỚC 4
========================================================= */

function validateJournalStep4() {

    const result =
        getJournalInputValue(
            "journal-result"
        );


    if (!result) {

        return {
            valid: false,
            message:
                "Bạn hãy viết điều mình nhận ra sau trải nghiệm này."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.6 — KIỂM TRA BƯỚC 5
========================================================= */

function validateJournalStep5() {

    const lesson =
        getJournalInputValue(
            "journal-lesson"
        );


    if (!lesson) {

        return {
            valid: false,
            message:
                "Bạn hãy ghi lại bài học của ngày hôm nay nhé."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.7 — KIỂM TRA BƯỚC 6
========================================================= */

function validateJournalStep6() {

    const goal =
        getJournalInputValue(
            "journal-goal"
        );


    if (!goal) {

        return {
            valid: false,
            message:
                "Bạn hãy viết một điều mình muốn làm vào ngày mai."
        };

    }


    return {
        valid: true
    };

}


/* =========================================================
   C3.8 — KIỂM TRA THEO BƯỚC HIỆN TẠI
========================================================= */

function validateCurrentJournalStep() {

    switch (
        currentJournalStep
    ) {

        case 1:

            return validateJournalStep1();


        case 2:

            return validateJournalStep2();


        case 3:

            return validateJournalStep3();


        case 4:

            return validateJournalStep4();


        case 5:

            return validateJournalStep5();


        case 6:

            return validateJournalStep6();


        default:

            return {
                valid: true
            };

    }

}


/* =========================================================
   C3.9 — HIỂN THỊ LỖI
========================================================= */

function showJournalValidationMessage(
    message
) {

    const saveStatus =
        document.getElementById(
            "journal-save-status"
        );


    if (!saveStatus) {

        return;

    }


    saveStatus.textContent =
        message;


    saveStatus.classList.add(
        "validation-error"
    );


    setTimeout(
        function () {

            saveStatus.classList.remove(
                "validation-error"
            );

        },
        1800
    );

}




/* =========================================================
   C4 — LƯU NHẬT KÝ
========================================================= */


/* =========================================================
   C4.1 — LẤY TOÀN BỘ DỮ LIỆU FORM
========================================================= */

function collectJournalData() {

    const now = new Date();


    return {

        id:
            `journal_${Date.now()}`,


        date:
            now.toISOString(),


        situation:
            getJournalInputValue(
                "journal-situation"
            ),


        emotion:
            window.selectedJournalEmotion || "",


        emotionNote:
            getJournalInputValue(
                "journal-emotion-note"
            ),


        s1:
            getJournalInputValue(
                "journal-s1"
            ),


        s2:
            getJournalInputValue(
                "journal-s2"
            ),


        s3:
            getJournalInputValue(
                "journal-s3"
            ),


        result:
            getJournalInputValue(
                "journal-result"
            ),


        lesson:
            getJournalInputValue(
                "journal-lesson"
            ),


        goal:
            getJournalInputValue(
                "journal-goal"
            ),


        feedback:
            "",


        createdAt:
            now.toISOString()

    };

}


/* =========================================================
   C4.2 — LẤY NHẬT KÝ ĐÃ LƯU
========================================================= */

function getSavedJournals() {

    try {

        const data =
            localStorage.getItem(
                "behav_journals"
            );


        if (!data) {

            return [];

        }


        const journals =
            JSON.parse(data);


        return Array.isArray(journals)
            ? journals
            : [];

    } catch (error) {

        console.error(
            "Không thể đọc nhật ký:",
            error
        );

        return [];

    }

}


/* =========================================================
   C4.3 — LƯU DANH SÁCH NHẬT KÝ
========================================================= */

function saveJournals(
    journals
) {

    try {

        localStorage.setItem(
            "behav_journals",
            JSON.stringify(journals)
        );


        return true;

    } catch (error) {

        console.error(
            "Không thể lưu nhật ký:",
            error
        );


        return false;

    }

}


/* =========================================================
   C4.4 — LƯU NHẬT KÝ HIỆN TẠI
========================================================= */

function saveCurrentJournal() {

    const journal =
        collectJournalData();


    const journals =
        getSavedJournals();


    journals.push(
        journal
    );


    const saved =
        saveJournals(
            journals
        );


    if (!saved) {

        return false;

    }


    /*
       Cập nhật Dashboard ngay lập tức.
    */

    if (
        typeof updateStudentDashboard
        === "function"
    ) {

        updateStudentDashboard();

    }


    return true;

}


/* =========================================================
   C4.5 — RESET FORM
========================================================= */

function resetJournalForm() {

    const inputs =
        document.querySelectorAll(
            "#journal .journal-textarea, " +
            "#journal textarea"
        );


    inputs.forEach(
        function (input) {

            input.value = "";

        }
    );


    /*
       Bỏ chọn cảm xúc
    */

    const emotions =
        document.querySelectorAll(
            ".emotion-option"
        );


    emotions.forEach(
        function (button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    window.selectedJournalEmotion =
        "";


    /*
       Reset bộ đếm
    */

    const counters = {

        "situation-count":
            "journal-situation",

        "result-count":
            "journal-result",

        "lesson-count":
            "journal-lesson",

        "goal-count":
            "journal-goal"

    };


    Object.entries(
        counters
    ).forEach(
        function ([counterId, inputId]) {

            const counter =
                document.getElementById(
                    counterId
                );


            const input =
                document.getElementById(
                    inputId
                );


            if (counter && input) {

                counter.textContent =
                    input.value.length;

            }

        }
    );


    /*
       Quay về bước 1
    */

    showJournalStep(1);

}


/* =========================================================
   C4.6 — THÔNG BÁO LƯU THÀNH CÔNG
========================================================= */

function showJournalSavedMessage() {

    const saveStatus =
        document.getElementById(
            "journal-save-status"
        );


    if (!saveStatus) {

        return;

    }


    saveStatus.textContent =
        "✓ Nhật ký đã được lưu";


    saveStatus.classList.remove(
        "validation-error"
    );


    saveStatus.classList.add(
        "journal-saved"
    );

}


/* =========================================================
   C4.7 — THAY HÀNH VI NÚT HOÀN THÀNH
========================================================= */

function completeJournal() {

    /*
       Kiểm tra bước 6
    */

    const validation =
        validateCurrentJournalStep();


    if (!validation.valid) {

        showJournalValidationMessage(
            validation.message
        );

        return;

    }


    /*
       Lưu dữ liệu
    */

    const saved =
        saveCurrentJournal();


    if (!saved) {

        showJournalValidationMessage(
            "Không thể lưu nhật ký. Bạn hãy thử lại nhé."
        );

        return;

    }


    /*
       Hiện thông báo
    */

    showJournalSavedMessage();


    /*
       Sau khi lưu một chút,
       quay về Dashboard.
    */

    setTimeout(
        function () {

            resetJournalForm();


            if (
                typeof navigateTo
                === "function"
            ) {

                navigateTo(
                    "dashboard"
                );

            }

        },
        900
    );

}




/* =========================================================
   C4.2 — LẤY DANH SÁCH NHẬT KÝ ĐÃ LƯU
========================================================= */

function getSavedJournals() {

    try {

        /* Lấy dữ liệu từ localStorage */

        const savedData =
            localStorage.getItem(
                "behav_journals"
            );


        /* Nếu chưa có nhật ký */

        if (!savedData) {

            return [];

        }


        /* Chuyển chuỗi JSON thành mảng */

        const journals =
            JSON.parse(
                savedData
            );


        /* Đảm bảo dữ liệu thực sự là một mảng */

        if (
            !Array.isArray(journals)
        ) {

            return [];

        }


        return journals;

    } catch (error) {

        console.error(
            "Không thể đọc dữ liệu nhật ký:",
            error
        );

        return [];

    }

}

/* =========================================================
   C4 — HOÀN THIỆN LƯU NHẬT KÝ
   GỘP: lưu + thông báo + reset + hoàn thành
========================================================= */


/* =========================================================
   01. LƯU NHẬT KÝ HIỆN TẠI
========================================================= */

function saveCurrentJournal() {

    const journal =
        collectJournalData();


    const journals =
        getSavedJournals();


    /*
       Thêm nhật ký mới vào danh sách cũ
    */

    journals.push(
        journal
    );


    /*
       Lưu lại toàn bộ danh sách
    */

    const saved =
        saveJournals(
            journals
        );


    if (!saved) {

        return false;

    }


    /*
       Nếu Dashboard đã có hàm cập nhật
       thì cập nhật ngay.
    */

    if (
        typeof updateStudentDashboard
        === "function"
    ) {

        updateStudentDashboard();

    }


    return true;

}


/* =========================================================
   02. HIỂN THỊ TRẠNG THÁI
========================================================= */

function setJournalStatus(
    message,
    type = ""
) {

    const status =
        document.getElementById(
            "journal-save-status"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    status.classList.remove(
        "validation-error",
        "journal-saved"
    );


    if (type) {

        status.classList.add(
            type
        );

    }

}


/* =========================================================
   03. RESET FORM
========================================================= */

function resetJournalForm() {

    /*
       Xóa toàn bộ textarea
    */

    const textareas =
        document.querySelectorAll(
            "#journal textarea"
        );


    textareas.forEach(
        function (textarea) {

            textarea.value = "";

        }
    );


    /*
       Bỏ chọn cảm xúc
    */

    const emotions =
        document.querySelectorAll(
            ".emotion-option"
        );


    emotions.forEach(
        function (button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    window.selectedJournalEmotion =
        "";


    /*
       Reset bộ đếm
    */

    const counterMap = {

        "situation-count":
            "journal-situation",

        "result-count":
            "journal-result",

        "lesson-count":
            "journal-lesson",

        "goal-count":
            "journal-goal"

    };


    Object.entries(
        counterMap
    ).forEach(
        function ([counterId, inputId]) {

            const counter =
                document.getElementById(
                    counterId
                );


            const input =
                document.getElementById(
                    inputId
                );


            if (
                counter &&
                input
            ) {

                counter.textContent =
                    input.value.length;

            }

        }
    );


    /*
       Quay về bước 1
    */

    if (
        typeof showJournalStep
        === "function"
    ) {

        showJournalStep(1);

    }


    setJournalStatus(
        "Chưa lưu"
    );

}


/* =========================================================
   04. HOÀN THÀNH NHẬT KÝ
========================================================= */

function completeJournal() {

    /*
       Kiểm tra bước cuối
    */

    const validation =
        validateCurrentJournalStep();


    if (!validation.valid) {

        if (
            typeof showJournalValidationMessage
            === "function"
        ) {

            showJournalValidationMessage(
                validation.message
            );

        }

        return;

    }


    /*
       Lưu
    */

    const saved =
        saveCurrentJournal();


    if (!saved) {

        setJournalStatus(
            "Không thể lưu nhật ký.",
            "validation-error"
        );

        return;

    }


    /*
       Báo thành công
    */

    setJournalStatus(
        "✓ Nhật ký đã được lưu!",
        "journal-saved"
    );


    /*
       Chờ một chút rồi về Dashboard
    */

    setTimeout(
        function () {

            resetJournalForm();


            if (
                typeof navigateTo
                === "function"
            ) {

                navigateTo(
                    "dashboard"
                );

            }

        },
        900
    );

}





/* =========================================================
   06. GẮN LẠI NÚT
========================================================= */

const finalJournalNextButton =
    document.getElementById(
        "journal-next"
    );


if (finalJournalNextButton) {

    /*
       Xóa event cũ bằng cách clone nút
       để tránh chạy nhiều hàm cùng lúc.
    */

    const newNextButton =
        finalJournalNextButton.cloneNode(
            true
        );


    finalJournalNextButton.parentNode.replaceChild(
        newNextButton,
        finalJournalNextButton
    );


    newNextButton.addEventListener(
        "click",
        goToNextJournalStep
    );

}


/* =========================================================
   07. NÚT QUAY LẠI
========================================================= */

const finalJournalBackButton =
    document.getElementById(
        "journal-back"
    );


if (finalJournalBackButton) {

    finalJournalBackButton.addEventListener(
        "click",
        function () {

            if (
                currentJournalStep > 1
            ) {

                showJournalStep(
                    currentJournalStep - 1
                );

            }

        }
    );

}

/* =========================================================
   C5 — TRẠNG THÁI SAU KHI LƯU
========================================================= */

function showJournalSavedState(journal) {

    const status =
        document.getElementById(
            "journal-save-status"
        );

    if (!status) {
        return;
    }


    const savedDate =
        journal && journal.date
            ? new Date(journal.date)
            : new Date();


    const formattedDate =
        savedDate.toLocaleDateString(
            "vi-VN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const formattedTime =
        savedDate.toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    status.innerHTML = `
        <span class="save-success-icon">
            ✓
        </span>

        <span>
            Đã lưu lúc ${formattedTime}
            · ${formattedDate}
        </span>
    `;


    status.classList.remove(
        "validation-error"
    );


    status.classList.add(
        "journal-saved"
    );

}


/* =========================================================
   C5 — TRẠNG THÁI LỖI
========================================================= */

function showJournalSaveError() {

    const status =
        document.getElementById(
            "journal-save-status"
        );


    if (!status) {
        return;
    }


    status.innerHTML = `
        <span class="save-error-icon">
            !
        </span>

        <span>
            Chưa thể lưu nhật ký. Hãy thử lại nhé.
        </span>
    `;


    status.classList.remove(
        "journal-saved"
    );


    status.classList.add(
        "validation-error"
    );

}


/* =========================================================
   C5 — HOÀN THÀNH NHẬT KÝ
========================================================= */

function completeJournal() {

    /*
       Kiểm tra bước cuối
    */

    const validation =
        validateCurrentJournalStep();


    if (!validation.valid) {

        if (
            typeof showJournalValidationMessage
            === "function"
        ) {

            showJournalValidationMessage(
                validation.message
            );

        }

        return;

    }


    /*
       Thu thập dữ liệu trước khi lưu
    */

    const journal =
        collectJournalData();


    /*
       Lấy dữ liệu cũ
    */

    const journals =
        getSavedJournals();


    /*
       Thêm nhật ký mới
    */

    journals.push(
        journal
    );


    /*
       Lưu xuống localStorage
    */

    const saved =
        saveJournals(
            journals
        );


    /*
       Nếu lưu thất bại
    */

    if (!saved) {

        showJournalSaveError();

        return;

    }


    /*
       Hiển thị thành công
    */

    showJournalSavedState(
        journal
    );


    /*
       Cập nhật Dashboard ngay
    */

    if (
        typeof updateStudentDashboard
        === "function"
    ) {

        updateStudentDashboard();

    }


    /*
       Khóa nút tạm thời để tránh
       học sinh bấm lưu 2 lần.
    */

    const nextButton =
        document.getElementById(
            "journal-next"
        );


    if (nextButton) {

        nextButton.disabled = true;

        nextButton.textContent =
            "Đã lưu ✓";

    }


    /*
       Sau khi hiển thị thành công
       mới chuyển về Dashboard.
    */

    setTimeout(
        function () {

            resetJournalForm();


            if (
                typeof navigateTo
                === "function"
            ) {

                navigateTo(
                    "dashboard"
                );

            }

        },
        1200
    );

}


/* =========================================================
   C5 — RESET FORM
========================================================= */

function resetJournalForm() {

    const textareas =
        document.querySelectorAll(
            "#journal textarea"
        );


    textareas.forEach(
        function (textarea) {

            textarea.value = "";

        }
    );


    const emotions =
        document.querySelectorAll(
            ".emotion-option"
        );


    emotions.forEach(
        function (button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    window.selectedJournalEmotion =
        "";


    /*
       Reset bộ đếm
    */

    const counterMap = {

        "situation-count":
            "journal-situation",

        "result-count":
            "journal-result",

        "lesson-count":
            "journal-lesson",

        "goal-count":
            "journal-goal"

    };


    Object.entries(
        counterMap
    ).forEach(
        function ([counterId, inputId]) {

            const counter =
                document.getElementById(
                    counterId
                );


            const input =
                document.getElementById(
                    inputId
                );


            if (
                counter &&
                input
            ) {

                counter.textContent =
                    input.value.length;

            }

        }
    );


    /*
       Reset nút
    */

    const nextButton =
        document.getElementById(
            "journal-next"
        );


    if (nextButton) {

        nextButton.disabled =
            false;

        nextButton.textContent =
            "Tiếp theo →";

    }


    /*
       Quay về bước 1
    */

    if (
        typeof showJournalStep
        === "function"
    ) {

        showJournalStep(1);

    }


    const status =
        document.getElementById(
            "journal-save-status"
        );


    if (status) {

        status.textContent =
            "Chưa lưu";

        status.classList.remove(
            "journal-saved",
            "validation-error"
        );

    }

}

/* =========================================================
   C6 — KẾT NỐI DASHBOARD VỚI NHẬT KÝ ĐÃ LƯU
========================================================= */


/* =========================================================
   01. CẬP NHẬT DASHBOARD
========================================================= */

function updateStudentDashboard() {

    const journals =
        getSavedJournals();


    /* Tổng số nhật ký */

    const totalElement =
        document.getElementById(
            "total-journals"
        );


    if (totalElement) {

        totalElement.textContent =
            journals.length;

    }


    /* Đếm phản hồi */

    let feedbackCount = 0;


    journals.forEach(
        function (journal) {

            if (
                journal.feedback &&
                String(
                    journal.feedback
                ).trim() !== ""
            ) {

                feedbackCount++;

            }

        }
    );


    const feedbackElement =
        document.getElementById(
            "feedback-count"
        );


    const pendingElement =
        document.getElementById(
            "pending-feedback"
        );


    if (feedbackElement) {

        feedbackElement.textContent =
            feedbackCount;

    }


    if (pendingElement) {

        pendingElement.textContent =
            Math.max(
                journals.length -
                feedbackCount,
                0
            );

    }


    /* Hiển thị nhật ký gần đây */

    renderRecentJournals(
        journals
    );

}


/* =========================================================
   02. HIỂN THỊ NHẬT KÝ GẦN ĐÂY
========================================================= */

function renderRecentJournals(
    journals
) {

    const container =
        document.getElementById(
            "recent-journals"
        );


    if (!container) {

        return;

    }


    if (
        !journals ||
        journals.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-journal">

                <div>
                    📖
                </div>

                <h3>
                    Chưa có nhật ký
                </h3>

                <p>
                    Hãy viết lại một điều nhỏ
                    về ngày hôm nay.
                </p>

                <button
                    class="primary-btn"
                    data-page="journal">

                    ✍️ Viết nhật ký

                </button>

            </div>

        `;


        return;

    }


    /*
       Lấy 5 nhật ký mới nhất.
    */

    const recentJournals =
        [...journals]
            .reverse()
            .slice(0, 5);


    container.innerHTML =
        recentJournals
            .map(
                function (journal) {

                  const displayDate =
    formatJournalDate(
        journal.date
    );



                    const title =
                        journal.situation ||
                        "Nhật ký của tôi";


                    const hasFeedback =
                        journal.feedback &&
                        String(
                            journal.feedback
                        ).trim() !== "";


                    return `

                        <div
                            class="
                                recent-journal-item
                                ${hasFeedback
                                    ? "has-feedback"
                                    : ""}
                            ">

                            <div
                                class="
                                    recent-journal-icon
                                ">

                                ${
                                    hasFeedback
                                        ? "💬"
                                        : "📝"
                                }

                            </div>


                            <div
                                class="
                                    recent-journal-info
                                ">

                                <strong>
                                    ${escapeDashboardText(
                                        title
                                    )}
                                </strong>

                                <small>
                                    ${displayDate}
                                </small>

                            </div>


                            <span
                                class="
                                    recent-journal-status
                                    ${
                                        hasFeedback
                                            ? "has-feedback"
                                            : "waiting-feedback"
                                    }
                                ">

                                ${
                                    hasFeedback
                                        ? "Đã phản hồi"
                                        : "Chờ phản hồi"
                                }

                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   03. CẬP NHẬT KHI VỪA LƯU
========================================================= */

function refreshDashboardAfterJournalSave() {

    updateStudentDashboard();


    /*
       Nếu Dashboard đang mở,
       cập nhật giao diện ngay.
    */

    const dashboard =
        document.getElementById(
            "dashboard"
        );


    if (
        dashboard &&
        dashboard.classList.contains(
            "active"
        )
    ) {

        updateStudentDashboard();

    }

}


/* =========================================================
   04. THEO DÕI THAY ĐỔI DỮ LIỆU
========================================================= */

window.addEventListener(
    "storage",
    function () {

        updateStudentDashboard();

    }
);


/* =========================================================
   05. KHỞI ĐỘNG DASHBOARD
========================================================= */

updateStudentDashboard();

/* =========================================================
   D1 — XEM LẠI NHẬT KÝ
   JS: đọc dữ liệu + danh sách + sắp xếp + tìm kiếm
========================================================= */


/* =========================================================
   01. LẤY DỮ LIỆU NHẬT KÝ
========================================================= */

function getReviewJournals() {

    try {

        const savedData =
            localStorage.getItem(
                "behav_journals"
            );


        if (!savedData) {

            return [];

        }


        const journals =
            JSON.parse(
                savedData
            );


        return Array.isArray(journals)
            ? journals
            : [];

    } catch (error) {

        console.error(
            "Không thể đọc nhật ký:",
            error
        );

        return [];

    }

}


/* =========================================================
   02. SẮP XẾP MỚI → CŨ
========================================================= */

function sortReviewJournals(
    journals
) {

    return [...journals].sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.date ||
                    a.createdAt ||
                    0
                ).getTime();


            const dateB =
                new Date(
                    b.date ||
                    b.createdAt ||
                    0
                ).getTime();


            return dateB - dateA;

        }
    );

}


/* =========================================================
   03. FORMAT NGÀY
========================================================= */

function formatReviewDate(
    journal
) {

    const rawDate =
        journal.date ||
        journal.createdAt;


    if (!rawDate) {

        return "Chưa có ngày";

    }


    const date =
        new Date(rawDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Chưa có ngày";

    }


    return date.toLocaleDateString(
        "vi-VN",
        {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================================================
   04. FORMAT GIỜ
========================================================= */

function formatReviewTime(
    journal
) {

    const rawDate =
        journal.date ||
        journal.createdAt;


    if (!rawDate) {

        return "";

    }


    const date =
        new Date(rawDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleTimeString(
        "vi-VN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   05. KIỂM TRA PHẢN HỒI
========================================================= */

function reviewHasFeedback(
    journal
) {

    return !!(
        journal.feedback &&
        String(
            journal.feedback
        ).trim() !== ""
    );

}


/* =========================================================
   06. TÌM KIẾM
========================================================= */

function filterReviewJournals(
    journals,
    keyword
) {

    const search =
        String(keyword || "")
            .trim()
            .toLowerCase();


    if (!search) {

        return journals;

    }


    return journals.filter(
        function (journal) {

            const text = [

                journal.situation,

                journal.emotion,

                journal.emotionNote,

                journal.s1,

                journal.s2,

                journal.s3,

                journal.result,

                journal.lesson,

                journal.goal

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return text.includes(
                search
            );

        }
    );

}


/* =========================================================
   07. TRẠNG THÁI HIỂN THỊ
========================================================= */

function getReviewStatus(
    journal
) {

    if (
        reviewHasFeedback(
            journal
        )
    ) {

        return {
            text: "Đã có phản hồi",
            className: "has-feedback"
        };

    }


    return {
        text: "Chờ phản hồi",
        className: "waiting-feedback"
    };

}


/* =========================================================
   08. ESCAPE TEXT
========================================================= */

function escapeReviewText(
    value
) {

    return String(value || "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   09. RENDER DANH SÁCH
========================================================= */

function renderReviewJournalList(
    journals
) {

    const container =
        document.getElementById(
            "review-journal-list"
        );


    if (!container) {

        return;

    }


    if (
        !journals ||
        journals.length === 0
    ) {

        container.innerHTML = `

            <div class="review-empty">

                <div>
                    📖
                </div>

                <h3>
                    Chưa có nhật ký nào
                </h3>

                <p>
                    Những điều bạn viết sẽ xuất hiện
                    ở đây để bạn có thể nhìn lại.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        journals.map(
            function (journal) {

                const status =
                    getReviewStatus(
                        journal
                    );


                const date =
                    formatReviewDate(
                        journal
                    );


                const time =
                    formatReviewTime(
                        journal
                    );


                const emotion =
                    journal.emotion ||
                    "Chưa chọn";


                const preview =
                    journal.situation ||
                    "Nhật ký của tôi";


                return `

                    <article
                        class="
                            review-journal-card
                            ${status.className}
                        "
                        data-journal-id="
                            ${escapeReviewText(
                                journal.id
                            )}
                        >

                        <div
                            class="
                                review-journal-icon
                            ">

                            ${
                                status.className
                                === "has-feedback"
                                    ? "💬"
                                    : "📝"
                            }

                        </div>


                        <div
                            class="
                                review-journal-content
                            ">

                            <div
                                class="
                                    review-journal-top
                                ">

                                <span
                                    class="
                                        review-journal-date
                                    ">

                                    ${escapeReviewText(
                                        date
                                    )}

                                    ${
                                        time
                                            ? ` · ${time}`
                                            : ""
                                    }

                                </span>


                                <span
                                    class="
                                        review-status
                                        ${status.className}
                                    ">

                                    ${status.text}

                                </span>

                            </div>


                            <h3>

                                ${escapeReviewText(
                                    preview
                                )}

                            </h3>


                            <span
                                class="
                                    review-emotion
                                ">

                                Cảm xúc:
                                ${escapeReviewText(
                                    emotion
                                )}

                            </span>


                            <button
                                type="button"
                                class="
                                    review-open-btn
                                "
                                data-review-id="
                                    ${escapeReviewText(
                                        journal.id
                                    )}
                                ">

                                Xem chi tiết →

                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    bindReviewOpenButtons();

}


/* =========================================================
   10. GẮN NÚT XEM CHI TIẾT
   Cấu trúc chi tiết sẽ làm ở D3
========================================================= */

function bindReviewOpenButtons() {

    const buttons =
        document.querySelectorAll(
            ".review-open-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const journalId =
                        button.dataset.reviewId;


                    /*
                       D3 sẽ dùng ID này
                       để mở nhật ký.
                    */

                    window.selectedReviewJournalId =
                        journalId;


                    console.log(
                        "Đã chọn nhật ký:",
                        journalId
                    );

                }
            );

        }
    );

}


/* =========================================================
   11. KHỞI TẠO TRANG XEM LẠI
========================================================= */

function initReviewPage() {

    const journals =
        sortReviewJournals(
            getReviewJournals()
        );


    renderReviewJournalList(
        journals
    );

}


/* =========================================================
   12. TÌM KIẾM KHI CÓ Ô SEARCH
========================================================= */

function setupReviewSearch() {

    const searchInput =
        document.getElementById(
            "review-search"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const journals =
                sortReviewJournals(
                    getReviewJournals()
                );


            const filtered =
                filterReviewJournals(
                    journals,
                    searchInput.value
                );


            renderReviewJournalList(
                filtered
            );

        }
    );

}


/* =========================================================
   13. KHỞI ĐỘNG
========================================================= */

initReviewPage();

setupReviewSearch();


/* =========================================================
   14. CẬP NHẬT KHI DỮ LIỆU THAY ĐỔI
========================================================= */

window.addEventListener(
    "storage",
    function () {

        initReviewPage();

    }
);

/* =========================================================
   D3 — XEM CHI TIẾT NHẬT KÝ
   JS: tìm đúng nhật ký + hiển thị toàn bộ nội dung
========================================================= */


/* =========================================================
   01. LẤY NHẬT KÝ THEO ID
========================================================= */

function getReviewJournalById(journalId) {

    const journals =
        getReviewJournals();


    return journals.find(
        function (journal) {

            return String(
                journal.id
            ) === String(
                journalId
            );

        }
    ) || null;

}


/* =========================================================
   02. FORMAT NGÀY + GIỜ CHI TIẾT
========================================================= */

function formatReviewDetailDate(
    journal
) {

    const rawDate =
        journal &&
        (
            journal.date ||
            journal.createdAt
        );


    if (!rawDate) {

        return "Chưa có thời gian";

    }


    const date =
        new Date(rawDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Chưa có thời gian";

    }


    const day =
        date.toLocaleDateString(
            "vi-VN",
            {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const time =
        date.toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    return `${day} · ${time}`;

}


/* =========================================================
   03. LẤY PHẢN HỒI
========================================================= */

function getReviewFeedback(
    journal
) {

    if (!journal) {

        return "";

    }


    return (
        journal.feedback ||
        journal.teacherFeedback ||
        ""
    );

}


/* =========================================================
   04. HIỂN THỊ CHI TIẾT
========================================================= */

function renderReviewJournalDetail(
    journal
) {

    const detailContainer =
        document.getElementById(
            "review-journal-detail"
        );


    if (!detailContainer) {

        return;

    }


    if (!journal) {

        detailContainer.innerHTML = `

            <div class="review-detail-empty">

                <div>
                    ⚠️
                </div>

                <h3>
                    Không tìm thấy nhật ký
                </h3>

                <p>
                    Nhật ký này có thể đã bị xóa
                    hoặc không còn tồn tại.
                </p>

            </div>

        `;

        return;

    }


    const feedback =
        getReviewFeedback(
            journal
        );


    const hasFeedback =
        String(
            feedback
        ).trim() !== "";


    detailContainer.innerHTML = `

        <div class="review-detail-card">


            <!-- HEADER -->

            <div
                class="review-detail-header">

                <div>

                    <span
                        class="review-detail-label">

                        ✦ NHẬT KÝ HỌC SINH

                    </span>


                    <h2>
                        ${escapeReviewText(
                            journal.situation ||
                            "Nhật ký của tôi"
                        )}
                    </h2>


                    <span
                        class="review-detail-date">

                        ${escapeReviewText(
                            formatReviewDetailDate(
                                journal
                            )
                        )}

                    </span>

                </div>


                <span
                    class="
                        review-detail-status
                        ${
                            hasFeedback
                                ? "has-feedback"
                                : "waiting-feedback"
                        }
                    ">

                    ${
                        hasFeedback
                            ? "✓ Đã có phản hồi"
                            : "⌛ Chờ phản hồi"
                    }

                </span>

            </div>


            <!-- CẢM XÚC -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    01 · CẢM XÚC

                </span>


                <h3>
                    ${
                        escapeReviewText(
                            journal.emotion ||
                            "Chưa chọn"
                        )
                    }
                </h3>


                ${
                    journal.emotionNote
                        ? `
                            <p>
                                ${escapeReviewText(
                                    journal.emotionNote
                                )}
                            </p>
                        `
                        : ""
                }

            </section>


            <!-- S1 -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    02 · SITUATION

                </span>


                <h3>
                    Điều gì đã xảy ra?
                </h3>


                <p>
                    ${escapeReviewText(
                        journal.s1 ||
                        journal.situation ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- S2 -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    03 · SELF

                </span>


                <h3>
                    Bạn đã phản ứng thế nào?
                </h3>


                <p>
                    ${escapeReviewText(
                        journal.s2 ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- S3 -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    04 · SOLUTION

                </span>


                <h3>
                    Bạn có thể làm gì khác?
                </h3>


                <p>
                    ${escapeReviewText(
                        journal.s3 ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- ĐIỀU NHẬN RA -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    05 · ĐIỀU NHẬN RA

                </span>


                <p>
                    ${escapeReviewText(
                        journal.result ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- BÀI HỌC -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    06 · BÀI HỌC

                </span>


                <p>
                    ${escapeReviewText(
                        journal.lesson ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- NGÀY MAI -->

            <section
                class="review-detail-section">

                <span
                    class="review-detail-section-label">

                    07 · NGÀY MAI

                </span>


                <p>
                    ${escapeReviewText(
                        journal.goal ||
                        "Chưa có nội dung."
                    )}
                </p>

            </section>


            <!-- PHẢN HỒI GIÁO VIÊN -->

            <section
                class="
                    review-feedback-section
                    ${
                        hasFeedback
                            ? "has-feedback"
                            : "waiting-feedback"
                    }
                ">

                <span
                    class="review-detail-section-label">

                    💬 PHẢN HỒI TỪ GIÁO VIÊN

                </span>


                ${
                    hasFeedback

                        ? `

                            <p>
                                ${escapeReviewText(
                                    feedback
                                )}
                            </p>

                        `

                        : `

                            <div
                                class="
                                    review-feedback-waiting
                                ">

                                <span>
                                    ⏳
                                </span>

                                <div>

                                    <strong>
                                        Chưa có phản hồi
                                    </strong>

                                    <small>
                                        Khi giáo viên gửi
                                        nhận xét, bạn sẽ
                                        thấy nội dung ở đây.
                                    </small>

                                </div>

                            </div>

                        `
                }

            </section>


        </div>

    `;

}


/* =========================================================
   05. MỞ CHI TIẾT
========================================================= */

function openReviewJournalDetail(
    journalId
) {

    const journal =
        getReviewJournalById(
            journalId
        );


    if (!journal) {

        renderReviewJournalDetail(
            null
        );

        return;

    }


    window.selectedReviewJournalId =
        journalId;


    renderReviewJournalDetail(
        journal
    );


    /*
       Ẩn danh sách
    */

    const list =
        document.getElementById(
            "review-journal-list"
        );


    if (list) {

        list.style.display =
            "none";

    }


    /*
       Hiện chi tiết
    */

    const detail =
        document.getElementById(
            "review-journal-detail"
        );


    if (detail) {

        detail.style.display =
            "block";

    }


    /*
       Cuộn lên đầu phần xem lại
    */

    const reviewPage =
        document.getElementById(
            "review"
        );


    if (reviewPage) {

        reviewPage.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );

    }

}


/* =========================================================
   06. QUAY LẠI DANH SÁCH
========================================================= */

function closeReviewJournalDetail() {

    const detail =
        document.getElementById(
            "review-journal-detail"
        );


    if (detail) {

        detail.style.display =
            "none";

    }


    const list =
        document.getElementById(
            "review-journal-list"
        );


    if (list) {

        list.style.display =
            "";

    }


    window.selectedReviewJournalId =
        null;


    /*
       Render lại để đảm bảo dữ liệu mới nhất
    */

    initReviewPage();

}


/* =========================================================
   07. GẮN LẠI NÚT XEM CHI TIẾT
========================================================= */

function bindReviewOpenButtons() {

    const buttons =
        document.querySelectorAll(
            ".review-open-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const journalId =
                        button.dataset.reviewId;


                    openReviewJournalDetail(
                        journalId
                    );

                }
            );

        }
    );

}


/* =========================================================
   08. NÚT QUAY LẠI CHI TIẾT
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const backButton =
            event.target.closest(
                "#review-detail-back"
            );


        if (!backButton) {

            return;

        }


        closeReviewJournalDetail();

    }
);


/* =========================================================
   09. TỰ CẬP NHẬT CHI TIẾT KHI DỮ LIỆU ĐỔI
========================================================= */

window.addEventListener(
    "storage",
    function () {

        if (
            window.selectedReviewJournalId
        ) {

            const journal =
                getReviewJournalById(
                    window.selectedReviewJournalId
                );


            renderReviewJournalDetail(
                journal
            );

        }

    }
);

function goToNextJournalStep() {

    if (currentJournalStep < TOTAL_JOURNAL_STEPS) {

        currentJournalStep++;

        showJournalStep(currentJournalStep);

        return;
    }

    completeJournal();
}

const journalNextButton =
    document.getElementById(
        "journal-next"
    );


if (journalNextButton) {

    journalNextButton.onclick =
        function () {

            goToNextJournalStep();

        };

}

/* =========================================================
   F3 — GIÁO VIÊN XEM / CHỌN / GỬI PHẢN HỒI
========================================================= */

/* ---------------------------------------------------------
   01. MỞ CHI TIẾT NHẬT KÝ
--------------------------------------------------------- */

function teacherViewJournal(journalId) {

    const journal =
        getTeacherJournalById(journalId);

    if (!journal) {
        showToast("Không tìm thấy nhật ký.");
        return;
    }

    const situation =
        journal.situation || "Chưa có nội dung";

    const emotion =
        journal.emotion || "Chưa ghi";

    const date =
        journal.date || "Chưa xác định";

    const oldFeedback =
        journal.feedback &&
        typeof journal.feedback === "object"
            ? journal.feedback.content || ""
            : "";

    const feedback =
        window.prompt(
            `NHẬT KÝ CỦA HỌC SINH\n\n` +
            `Ngày: ${date}\n` +
            `Cảm xúc: ${emotion}\n\n` +
            `Chuyện gì đã xảy ra?\n` +
            `${situation}\n\n` +
            `Nhập phản hồi của giáo viên:`,
            oldFeedback
        );

    if (feedback === null) {
        return;
    }

    teacherSaveFeedback(
        journalId,
        feedback
    );
}


/* ---------------------------------------------------------
   02. LƯU PHẢN HỒI
--------------------------------------------------------- */

function teacherSaveFeedback(
    journalId,
    feedbackContent
) {

    const content =
        String(
            feedbackContent || ""
        ).trim();

    if (!content) {

        showToast(
            "Bạn hãy nhập nội dung phản hồi."
        );

        return;
    }

    const journal =
        getTeacherJournalById(
            journalId
        );

    if (!journal) {

        showToast(
            "Không tìm thấy nhật ký."
        );

        return;
    }


    /* -----------------------------------------
       LƯU PHẢN HỒI
    ----------------------------------------- */

    journal.feedback = {

        teacherId:
            currentTeacher.id,

        teacherName:
            currentTeacher.name,

        date:
            new Date().toLocaleDateString(
                "vi-VN"
            ),

        content:
            content
    };


    /* -----------------------------------------
       LƯU LOCAL STORAGE
    ----------------------------------------- */

    saveTeacherData();


    /* -----------------------------------------
       THÔNG BÁO
    ----------------------------------------- */

    showToast(
        "Đã gửi phản hồi cho học sinh ✓"
    );


    /* -----------------------------------------
       RENDER LẠI GIAO DIỆN
    ----------------------------------------- */

    if (
        typeof renderTeacherStudents ===
        "function"
    ) {
        renderTeacherStudents();
    }

    if (
        typeof renderTeacherRecentJournals ===
        "function"
    ) {
        renderTeacherRecentJournals();
    }

    if (
        typeof renderReviewPage ===
        "function"
    ) {
        renderReviewPage();
    }

}


/* ---------------------------------------------------------
   03. XÓA PHẢN HỒI
--------------------------------------------------------- */

function teacherRemoveFeedback(
    journalId
) {

    const journal =
        getTeacherJournalById(
            journalId
        );

    if (!journal) {
        return;
    }

    journal.feedback = null;

    saveTeacherData();

    showToast(
        "Đã xóa phản hồi."
    );

}


/* ---------------------------------------------------------
   04. LẤY NHẬT KÝ CHỜ PHẢN HỒI
--------------------------------------------------------- */

function getPendingTeacherJournals() {

    return getTeacherJournals()
        .filter(
            journal =>
                !teacherJournalHasFeedback(
                    journal
                )
        );
}


/* ---------------------------------------------------------
   05. LẤY NHẬT KÝ ĐÃ PHẢN HỒI
--------------------------------------------------------- */

function getRepliedTeacherJournals() {

    return getTeacherJournals()
        .filter(
            journal =>
                teacherJournalHasFeedback(
                    journal
                )
        );
}