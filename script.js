// ========================================
// Supabase
// ========================================

const SUPABASE_URL = "https://xqsdrgtlkwpzzstoches.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_a-DKrUN4Dj8Xq14m3sNvfQ_RWp1YaII";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// DOM Elements
// ========================================

const introScreen =
    document.getElementById("intro-screen");

const fadeElements =
    document.querySelectorAll(".fade-element");

const loginBtn =
    document.getElementById("login-btn");

const logoutBtn =
    document.getElementById("logout-btn");

const addFormBtn =
    document.getElementById("show-add-form");

const addForm =
    document.getElementById("add-product-form");

const galleryContainer =
    document.getElementById("gallery-container");

const saveProductBtn =
    document.getElementById("save-product");

const imageModal =
    document.getElementById("imageModal");

const modalContent =
    document.getElementById("modalContent");

const caption =
    document.getElementById("caption");


// ========================================
// Search Elements
// ========================================

const searchInput =
    document.getElementById("product-search");

const clearSearchBtn =
    document.getElementById("clear-search");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ========================================
// Mobile Menu
// ========================================

const menuToggle =
    document.getElementById("menu-toggle");

const mainNav =
    document.getElementById("main-nav");


// ========================================
// Products State
// ========================================

let allProducts = [];

let currentFilter = "all";

let currentSearch = "";


// ========================================
// Intro Animation
// ========================================

function startIntroAnimation() {

    if (!introScreen) return;

    setTimeout(() => {

        introScreen.style.opacity = "0";

        introScreen.style.visibility =
            "hidden";


        fadeElements.forEach(
            (element, index) => {

                setTimeout(() => {

                    element.classList.add("show");

                }, index * 150);

            }
        );

    }, 1800);
}


// ========================================
// Admin Controls
// ========================================

function hideAdminControls() {

    if (addFormBtn) {

        addFormBtn.style.display =
            "none";
    }


    if (addForm) {

        addForm.style.display =
            "none";
    }


    if (logoutBtn) {

        logoutBtn.style.display =
            "none";
    }


    if (loginBtn) {

        loginBtn.style.display =
            "inline-block";
    }
}


function showAdminControls() {

    if (addFormBtn) {

        addFormBtn.style.display =
            "inline-block";
    }


    if (logoutBtn) {

        logoutBtn.style.display =
            "inline-block";
    }


    if (loginBtn) {

        loginBtn.style.display =
            "none";
    }
}


// ========================================
// Check Logged User
// ========================================

async function checkUser() {

    try {

        const { data, error } =
            await supabaseClient.auth.getUser();


        if (error || !data.user) {

            hideAdminControls();

            return false;
        }


        showAdminControls();

        return true;

    } catch (error) {

        console.error(error);

        hideAdminControls();

        return false;
    }
}


// ========================================
// Login
// ========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async () => {

            const email =
                prompt(
                    "اكتبي البريد الإلكتروني للأدمن:"
                );


            if (!email) return;


            const password =
                prompt(
                    "اكتبي كلمة المرور:"
                );


            if (!password) return;


            try {

                const { error } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    alert(
                        "فشل تسجيل الدخول:\n" +
                        error.message
                    );

                    return;
                }


                alert(
                    "تم تسجيل الدخول بنجاح 🔐✨"
                );


                showAdminControls();

                await renderProducts();

            } catch (error) {

                console.error(error);

                alert(
                    "حدث خطأ أثناء تسجيل الدخول"
                );
            }

        }
    );

}


// ========================================
// Logout
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                const { error } =
                    await supabaseClient.auth
                        .signOut();


                if (error) {

                    alert(
                        "حدث خطأ أثناء تسجيل الخروج"
                    );

                    return;
                }


                hideAdminControls();

                alert(
                    "تم تسجيل الخروج 👋"
                );


                await renderProducts();

            } catch (error) {

                console.error(error);

            }

        }
    );

}


// ========================================
// Add Product Form Toggle
// ========================================

if (addFormBtn && addForm) {

    addFormBtn.addEventListener(
        "click",
        () => {

            const isHidden =
                addForm.style.display === "none" ||
                addForm.style.display === "";


            if (isHidden) {

                addForm.style.display =
                    "block";

                addFormBtn.textContent =
                    "إغلاق النموذج";

                addForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            } else {

                addForm.style.display =
                    "none";

                addFormBtn.textContent =
                    "+ إضافة منتج جديد";
            }

        }
    );

}


// ========================================
// Get Products From Supabase
// ========================================

async function renderProducts() {

    if (!galleryContainer) return;


    galleryContainer.innerHTML = `
        <p class="products-message">
            جاري تحميل المنتجات...
        </p>
    `;


    try {

        const {
            data: products,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(error);

            galleryContainer.innerHTML = `
                <p class="products-message error-message">
                    حدث خطأ أثناء تحميل المنتجات
                </p>
            `;

            return;
        }


        allProducts =
            products || [];


        const {
            data: userData
        } =
            await supabaseClient.auth.getUser();


        const isAdmin =
            !!userData.user;


        displayProducts(
            allProducts,
            isAdmin
        );


    } catch (error) {

        console.error(error);

        galleryContainer.innerHTML = `
            <p class="products-message error-message">
                حدث خطأ أثناء الاتصال بقاعدة البيانات
            </p>
        `;
    }
}


// ========================================
// Display Products
// ========================================

function displayProducts(
    products,
    isAdmin
) {

    if (!galleryContainer) return;


    galleryContainer.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        galleryContainer.innerHTML = `
            <p class="products-message">
                لا توجد منتجات مطابقة للبحث 🔍
            </p>
        `;

        return;
    }


    products.forEach(product => {

        createProductCard(
            product,
            isAdmin
        );

    });
}


// ========================================
// Search + Filter
// ========================================

function filterProducts() {

    const searchText =
        currentSearch
            .trim()
            .toLowerCase();


    const filteredProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();


                // البحث

                const matchesSearch =
                    searchText === "" ||
                    name.includes(searchText) ||
                    description.includes(searchText);


                // الفلتر

                let matchesFilter = true;


                if (
                    currentFilter !== "all"
                ) {

                    const filterText =
                        currentFilter.toLowerCase();


                    matchesFilter =
                        name.includes(filterText) ||
                        description.includes(filterText);
                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    checkUser().then(isAdmin => {

        displayProducts(
            filteredProducts,
            isAdmin
        );

    });

}


// ========================================
// Search Input
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            currentSearch =
                searchInput.value;


            filterProducts();

        }
    );

}


// ========================================
// Clear Search
// ========================================

if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

            }


            currentSearch = "";


            filterProducts();


            if (searchInput) {

                searchInput.focus();

            }

        }
    );

}


// ========================================
// Filter Buttons
// ========================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter ||
                    "all";


                filterProducts();

            }
        );

    }
);


// ========================================
// Create Product Card
// ========================================

function createProductCard(
    product,
    isAdmin
) {

    const card =
        document.createElement("article");


    card.className =
        "gallery-item fade-element show";


    const imageUrl =
        product.image_url &&
        product.image_url.trim() !== ""
            ? product.image_url
            : "ms.png";


    const productName =
        product.name || "منتج";


    const productDescription =
        product.description || "";


    // ========================================
    // WhatsApp
    // ========================================

    const whatsappMessage =
        `مرحبًا، أريد الاستفسار عن المنتج: ${productName}`;


    const whatsappUrl =
        `https://wa.me/201556051932?text=${encodeURIComponent(
            whatsappMessage
        )}`;


    // ========================================
    // Product Card HTML
    // ========================================

    card.innerHTML = `

        <div class="item-img-wrapper">

            <img
                src="${escapeHTML(imageUrl)}"
                alt="${escapeHTML(productName)}"
                class="clickable-img"
                loading="lazy"
            >

        </div>


        <div class="item-content">

            <h3>
                ${escapeHTML(productName)}
            </h3>


            <p>
                ${escapeHTML(productDescription)}
            </p>


            <div class="order-section">

                <p class="order-title">
                    للطلب والتواصل 🌸
                </p>


                <a
                    href="${whatsappUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="whatsapp-btn"
                >
                    💬 اطلب عبر واتساب
                </a>


                <a
                    href="https://www.facebook.com/share/g/19DZh5pJpd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="facebook-btn"
                >
                    زوروا صفحتنا على الفيسبوك
                </a>

            </div>

        </div>

    `;


    // ========================================
    // Delete - Admin Only
    // ========================================

    if (isAdmin) {

        const deleteButton =
            document.createElement("button");


        deleteButton.textContent =
            "حذف المنتج";


        deleteButton.className =
            "btn-delete";


        deleteButton.addEventListener(
            "click",
            async () => {

                const confirmDelete =
                    confirm(
                        "هل أنتِ متأكدة من حذف هذا المنتج؟"
                    );


                if (!confirmDelete) return;


                try {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("products")
                            .delete()
                            .eq(
                                "id",
                                product.id
                            );


                    if (error) {

                        alert(
                            "فشل حذف المنتج:\n" +
                            error.message
                        );

                        return;
                    }


                    alert(
                        "تم حذف المنتج بنجاح 🗑️"
                    );


                    await renderProducts();

                } catch (error) {

                    console.error(error);

                    alert(
                        "حدث خطأ أثناء حذف المنتج"
                    );
                }

            }
        );


        card
            .querySelector(
                ".item-content"
            )
            .appendChild(
                deleteButton
            );

    }


    // ========================================
    // Image Modal
    // ========================================

    const image =
        card.querySelector(
            ".clickable-img"
        );


    if (image) {

        image.addEventListener(
            "click",
            () => {

                openImageModal(
                    imageUrl,
                    productName
                );

            }
        );

    }


    galleryContainer.appendChild(
        card
    );

}


// ========================================
// Escape HTML
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;
}


// ========================================
// Image Modal
// ========================================

function openImageModal(
    imageUrl,
    productName
) {

    if (
        !imageModal ||
        !modalContent
    ) {

        return;
    }


    modalContent.src =
        imageUrl;


    modalContent.alt =
        productName ||
        "صورة المنتج";


    if (caption) {

        caption.textContent =
            productName ||
            "صورة المنتج";

    }


    imageModal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


function closeImageModal() {

    if (!imageModal) return;


    imageModal.style.display =
        "none";


    if (modalContent) {

        modalContent.src = "";

    }


    document.body.style.overflow =
        "";

}


// ========================================
// Close Modal
// ========================================

if (imageModal) {

    imageModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                imageModal
            ) {

                closeImageModal();

            }

        }
    );

}


// ========================================
// Escape Key
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            imageModal &&
            imageModal.style.display ===
                "flex"
        ) {

            closeImageModal();

        }

    }
);


// ========================================
// Add Product
// ========================================

if (saveProductBtn) {

    saveProductBtn.addEventListener(
        "click",
        async () => {

            const {
                data: userData
            } =
                await supabaseClient.auth
                    .getUser();


            if (!userData.user) {

                alert(
                    "لازم تسجلي دخول الأدمن الأول 🔐"
                );

                return;
            }


            const titleInput =
                document.getElementById(
                    "product-title"
                );


            const descInput =
                document.getElementById(
                    "product-desc"
                );


            const imgInput =
                document.getElementById(
                    "product-img"
                );


            const title =
                titleInput.value.trim();


            const description =
                descInput.value.trim();


            const file =
                imgInput.files[0];


            // ========================================
            // Validation
            // ========================================

            if (
                !title ||
                !description
            ) {

                alert(
                    "من فضلك اكتبي اسم المنتج والوصف"
                );

                return;
            }


            if (!file) {

                alert(
                    "من فضلك اختاري صورة المنتج"
                );

                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "من فضلك اختاري ملف صورة صحيح"
                );

                return;
            }


            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                alert(
                    "حجم الصورة كبير جدًا. الحد الأقصى 5MB."
                );

                return;
            }


            saveProductBtn.disabled =
                true;


            saveProductBtn.textContent =
                "جاري النشر...";


            try {

                // ========================================
                // File Extension
                // ========================================

                const fileExtension =
                    file.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                // ========================================
                // Unique File Name
                // ========================================

                const fileName =
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .substring(
                            2,
                            8
                        ) +
                    "." +
                    fileExtension;


                // ========================================
                // Upload
                // ========================================

                const {
                    error: uploadError
                } =
                    await supabaseClient
                        .storage
                        .from("products")
                        .upload(
                            fileName,
                            file,
                            {
                                cacheControl:
                                    "3600",

                                upsert:
                                    false
                            }
                        );


                if (uploadError) {

                    throw uploadError;

                }


                // ========================================
                // Public URL
                // ========================================

                const {
                    data:
                        publicUrlData
                } =
                    supabaseClient
                        .storage
                        .from(
                            "products"
                        )
                        .getPublicUrl(
                            fileName
                        );


                const imageUrl =
                    publicUrlData.publicUrl;


                // ========================================
                // Insert Product
                // ========================================

                const {
                    error:
                        insertError
                } =
                    await supabaseClient
                        .from(
                            "products"
                        )
                        .insert([
                            {

                                name:
                                    title,

                                description:
                                    description,

                                image_url:
                                    imageUrl,

                                whatsapp:
                                    "201556051932",

                                facebook:
                                    "https://www.facebook.com/share/g/19DZh5pJpd/"

                            }
                        ]);


                if (insertError) {

                    throw insertError;

                }


                // ========================================
                // Success
                // ========================================

                alert(
                    "تم نشر المنتج بنجاح ✨"
                );


                titleInput.value =
                    "";


                descInput.value =
                    "";


                imgInput.value =
                    "";


                addForm.style.display =
                    "none";


                addFormBtn.textContent =
                    "+ إضافة منتج جديد";


                await renderProducts();

            } catch (error) {

                console.error(error);

                alert(
                    "حدث خطأ:\n" +
                    error.message
                );

            } finally {

                saveProductBtn.disabled =
                    false;


                saveProductBtn.textContent =
                    "نشر المنتج";

            }

        }
    );

}


// ========================================
// Active Navbar
// ========================================

function setupActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            'nav a[href^="#"]'
        );


    if (
        !sections.length ||
        !navLinks.length
    ) {

        return;
    }


    function updateActiveLink() {

        let currentSection =
            "home";


        const scrollPosition =
            window.scrollY + 180;


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop;


                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;


                if (
                    scrollPosition >=
                        sectionTop &&
                    scrollPosition <
                        sectionBottom
                ) {

                    currentSection =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    "#" +
                        currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveLink,
        {
            passive: true
        }
    );


    updateActiveLink();

}


// ========================================
// Navigation
// ========================================

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(
            'nav a[href^="#"]'
        );


    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.forEach(
                        navLink => {

                            navLink.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );


                    // Close mobile menu

                    if (
                        mainNav
                    ) {

                        mainNav.classList.remove(
                            "open"
                        );

                    }


                    if (
                        menuToggle
                    ) {

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }
    );

}


// ========================================
// Mobile Menu
// ========================================

function setupMobileMenu() {

    if (
        !menuToggle ||
        !mainNav
    ) {

        return;
    }


    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle(
                    "open"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


// ========================================
// Close Mobile Menu Outside
// ========================================

document.addEventListener(
    "click",
    event => {

        if (
            !menuToggle ||
            !mainNav
        ) {

            return;
        }


        const clickedInsideMenu =
            mainNav.contains(
                event.target
            );


        const clickedButton =
            menuToggle.contains(
                event.target
            );


        if (
            !clickedInsideMenu &&
            !clickedButton
        ) {

            mainNav.classList.remove(
                "open"
            );


            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


// ========================================
// Initialize
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        startIntroAnimation();

        hideAdminControls();

        setupActiveNavigation();

        setupNavigation();

        setupMobileMenu();

        await checkUser();

        await renderProducts();

    }
);
