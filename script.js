// ========================================
// Supabase
// ========================================

const SUPABASE_URL = "https://xqsdrgtlkwpzzstoches.supabase.co";
const SUPABASE_KEY = "sb_publishable_a-DKrUN4Dj8Xq14m3sNvfQ_RWp1YaII";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// DOM Elements
// ========================================

const introScreen = document.getElementById("intro-screen");
const fadeElements = document.querySelectorAll(".fade-element");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const addFormBtn = document.getElementById("show-add-form");
const addForm = document.getElementById("add-product-form");

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
// Intro Animation
// ========================================

function startIntroAnimation() {

    if (!introScreen) return;

    setTimeout(() => {

        introScreen.style.opacity = "0";
        introScreen.style.visibility = "hidden";

        fadeElements.forEach((element, index) => {

            setTimeout(() => {

                element.classList.add("show");

            }, index * 150);

        });

    }, 1800);
}


// ========================================
// Admin Controls
// ========================================

function hideAdminControls() {

    if (addFormBtn) {
        addFormBtn.style.display = "none";
    }

    if (addForm) {
        addForm.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "none";
    }

    if (loginBtn) {
        loginBtn.style.display = "inline-block";
    }
}


function showAdminControls() {

    if (addFormBtn) {
        addFormBtn.style.display = "inline-block";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }

    if (loginBtn) {
        loginBtn.style.display = "none";
    }
}


// ========================================
// Check Logged User
// ========================================

async function checkUser() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {

        hideAdminControls();

        return false;
    }

    showAdminControls();

    return true;
}


// ========================================
// Login
// ========================================

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email =
            prompt("اكتبي البريد الإلكتروني للأدمن:");

        if (!email) return;


        const password =
            prompt("اكتبي كلمة المرور:");

        if (!password) return;


        const { error } =
            await supabaseClient.auth.signInWithPassword({

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

    });

}


// ========================================
// Logout
// ========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const { error } =
            await supabaseClient.auth.signOut();


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

    });

}


// ========================================
// Add Product Form
// ========================================

if (addFormBtn && addForm) {

    addFormBtn.addEventListener("click", () => {

        const isHidden =
            addForm.style.display === "none" ||
            addForm.style.display === "";


        if (isHidden) {

            addForm.style.display = "block";

            addFormBtn.textContent =
                "إغلاق النموذج";

        } else {

            addForm.style.display = "none";

            addFormBtn.textContent =
                "+ إضافة منتج جديد";

        }

    });

}


// ========================================
// Render Products
// ========================================

async function renderProducts() {

    if (!galleryContainer) return;


    galleryContainer.innerHTML = `
        <p class="products-message">
            جاري تحميل المنتجات...
        </p>
    `;


    const { data: products, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        galleryContainer.innerHTML = `
            <p class="products-message error-message">
                حدث خطأ أثناء تحميل المنتجات
            </p>
        `;

        return;
    }


    galleryContainer.innerHTML = "";


    if (!products || products.length === 0) {

        galleryContainer.innerHTML = `
            <p class="products-message">
                لا توجد منتجات حتى الآن 🌸
            </p>
        `;

        return;
    }


    const { data: userData } =
        await supabaseClient.auth.getUser();


    const isAdmin =
        !!userData.user;


    products.forEach(product => {

        createProductCard(
            product,
            isAdmin
        );

    });

}


// ========================================
// Create Product Card
// ========================================

function createProductCard(product, isAdmin) {

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
    // WhatsApp Message
    // ========================================

    const whatsappMessage =
        `مرحبًا، أريد الاستفسار عن المنتج: ${productName}`;


    const whatsappUrl =
        `https://wa.me/201556051932?text=${encodeURIComponent(
            whatsappMessage
        )}`;


    // ========================================
    // Product HTML
    // ========================================

    card.innerHTML = `

        <div class="item-img-wrapper">

            <img
                src="${imageUrl}"
                alt="${productName}"
                class="clickable-img"
                loading="lazy"
            >

        </div>


        <div class="item-content">

            <h3>
                ${productName}
            </h3>


            <p>
                ${productDescription}
            </p>


            <div class="order-section">

                <p class="order-title">
                    للطلب والتواصل 🌸
                </p>


                <!-- WhatsApp -->

                <a
                    href="${whatsappUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="whatsapp-btn"
                >
                    💬 اطلب عبر واتساب
                </a>


                <!-- Facebook -->

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
    // Delete Button - Admin Only
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


                const { error } =
                    await supabaseClient
                        .from("products")
                        .delete()
                        .eq("id", product.id);


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

            }
        );


        card
            .querySelector(".item-content")
            .appendChild(deleteButton);

    }


    // ========================================
    // Open Image Modal
    // ========================================

    const image =
        card.querySelector(".clickable-img");


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


    galleryContainer.appendChild(card);

}


// ========================================
// Image Modal
// ========================================

function openImageModal(imageUrl, productName) {

    if (!imageModal || !modalContent) {
        return;
    }


    modalContent.src = imageUrl;

    modalContent.alt =
        productName || "صورة المنتج";


    if (caption) {

        caption.textContent =
            productName || "صورة المنتج";

    }


    imageModal.style.display = "block";

    document.body.style.overflow = "hidden";

}


function closeImageModal() {

    if (!imageModal) return;


    imageModal.style.display = "none";

    document.body.style.overflow = "";

}


// ========================================
// Close Modal By Clicking Background
// ========================================

if (imageModal) {

    imageModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === imageModal
            ) {

                closeImageModal();

            }

        }
    );

}


// ========================================
// Escape To Close Image
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            imageModal &&
            imageModal.style.display === "block"
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

            // ========================================
            // Check Login
            // ========================================

            const { data: userData } =
                await supabaseClient.auth.getUser();


            if (!userData.user) {

                alert(
                    "لازم تسجلي دخول الأدمن الأول 🔐"
                );

                return;
            }


            // ========================================
            // Get Inputs
            // ========================================

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
            // Validate
            // ========================================

            if (!title || !description) {

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


            // ========================================
            // Check Image Type
            // ========================================

            if (!file.type.startsWith("image/")) {

                alert(
                    "من فضلك اختاري ملف صورة صحيح"
                );

                return;
            }


            // ========================================
            // Check Image Size
            // ========================================

            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                alert(
                    "حجم الصورة كبير جدًا. الحد الأقصى 5MB."
                );

                return;
            }


            // ========================================
            // Disable Button
            // ========================================

            saveProductBtn.disabled = true;

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
                        .substring(2, 8) +
                    "." +
                    fileExtension;


                const filePath =
                    fileName;


                // ========================================
                // Upload Image
                // ========================================

                const { error: uploadError } =
                    await supabaseClient.storage
                        .from("products")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl: "3600",
                                upsert: false
                            }
                        );


                if (uploadError) {

                    throw uploadError;

                }


                // ========================================
                // Get Public Image URL
                // ========================================

                const { data: publicUrlData } =
                    supabaseClient.storage
                        .from("products")
                        .getPublicUrl(
                            filePath
                        );


                const imageUrl =
                    publicUrlData.publicUrl;


                // ========================================
                // Insert Product
                // ========================================

                const { error: insertError } =
                    await supabaseClient
                        .from("products")
                        .insert([
                            {
                                name: title,
                                description: description,
                                image_url: imageUrl,
                                whatsapp: "201556051932",
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


                titleInput.value = "";

                descInput.value = "";

                imgInput.value = "";


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
// Active Navbar Link
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


    if (!sections.length || !navLinks.length) {
        return;
    }


    function updateActiveLink() {

        let currentSection =
            "home";


        const scrollPosition =
            window.scrollY + 180;


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop;


            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {

                currentSection =
                    section.id;

            }

        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

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
// Smooth Navigation
// ========================================

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(
            'nav a[href^="#"]'
        );


    navLinks.forEach(link => {

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

            }
        );

    });

}


// ========================================
// Initialize Website
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        startIntroAnimation();

        hideAdminControls();

        setupActiveNavigation();

        setupNavigation();

        await checkUser();

        await renderProducts();

    }
);
