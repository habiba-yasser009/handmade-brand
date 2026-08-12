// ===============================
// Supabase
// ===============================

const SUPABASE_URL = "https://xqsdrgtlkwpzzstoches.supabase.co";
const SUPABASE_KEY = "sb_publishable_a-DKrUN4Dj8Xq14m3sNvfQ_RWp1YaII";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// عند تحميل الموقع
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

    // -------------------------------
    // شاشة الترحيب
    // -------------------------------

    const introScreen = document.getElementById("intro-screen");
    const fadeElements = document.querySelectorAll(".fade-element");

    setTimeout(() => {

        if (introScreen) {
            introScreen.style.opacity = "0";
            introScreen.style.visibility = "hidden";
        }

        fadeElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add("show");
            }, index * 200);
        });

    }, 2000);


    // -------------------------------
    // عناصر الأدمن
    // -------------------------------

    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const addFormBtn = document.getElementById("show-add-form");
    const addForm = document.getElementById("add-product-form");


    // -------------------------------
    // إخفاء أدوات الأدمن في البداية
    // -------------------------------

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


    // -------------------------------
    // إظهار أدوات الأدمن
    // -------------------------------

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


    // -------------------------------
    // معرفة هل الأدمن مسجل دخول
    // -------------------------------

    async function checkUser() {

        const { data, error } = await supabaseClient.auth.getUser();

        if (error || !data.user) {
            hideAdminControls();
            return false;
        }

        showAdminControls();
        return true;
    }


    // -------------------------------
    // تسجيل الدخول
    // -------------------------------

    if (loginBtn) {

        loginBtn.addEventListener("click", async () => {

            const email = prompt("اكتبي البريد الإلكتروني للأدمن:");

            if (!email) {
                return;
            }

            const password = prompt("اكتبي كلمة المرور:");

            if (!password) {
                return;
            }


            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            if (error) {

                alert("فشل تسجيل الدخول:\n" + error.message);

                return;
            }


            alert("تم تسجيل الدخول بنجاح 🔐✨");

            showAdminControls();

            await renderProducts();
        });
    }


    // -------------------------------
    // تسجيل الخروج
    // -------------------------------

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                alert("حدث خطأ أثناء تسجيل الخروج");

                return;
            }

            hideAdminControls();

            alert("تم تسجيل الخروج 👋");

            await renderProducts();
        });
    }


    // -------------------------------
    // زر إضافة المنتج
    // -------------------------------

    if (addFormBtn && addForm) {

        addFormBtn.addEventListener("click", () => {

            if (
                addForm.style.display === "none" ||
                addForm.style.display === ""
            ) {

                addForm.style.display = "block";

                addFormBtn.textContent = "إغلاق النموذج";

            } else {

                addForm.style.display = "none";

                addFormBtn.textContent =
                    "+ إضافة منتج جديد";
            }
        });
    }


    // ===============================
    // عرض المنتجات
    // ===============================

    const galleryContainer =
        document.getElementById("gallery-container");


    async function renderProducts() {

        if (!galleryContainer) {
            return;
        }


        galleryContainer.innerHTML = `
            <p style="text-align:center;">
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
                <p style="text-align:center;color:red;">
                    حدث خطأ أثناء تحميل المنتجات
                </p>
            `;

            return;
        }


        galleryContainer.innerHTML = "";


        if (!products || products.length === 0) {

            galleryContainer.innerHTML = `
                <p style="text-align:center;">
                    لا توجد منتجات حتى الآن 🌸
                </p>
            `;

            return;
        }


        const { data: userData } =
            await supabaseClient.auth.getUser();

        const isAdmin = !!userData.user;


        products.forEach((product) => {

            createProductCard(product, isAdmin);

        });
    }


    // ===============================
    // إنشاء كارت المنتج
    // ===============================

    function createProductCard(product, isAdmin) {

        const newCard =
            document.createElement("div");

        newCard.className =
            "gallery-item fade-element show";


        const imageUrl =
            product.image_url &&
            product.image_url.trim() !== ""
                ? product.image_url
                : "ms.png";


        newCard.innerHTML = `

            <div
                class="item-img-wrapper"
                style="
                    width:100%;
                    height:220px;
                    overflow:hidden;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#fff;
                "
            >

                <img
                    src="${imageUrl}"
                    alt="${product.name || "منتج"}"
                    class="clickable-img"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        cursor:pointer;
                    "
                >

            </div>


            <div class="item-content">

                <h3>
                    ${product.name || "منتج"}
                </h3>

                <p>
                    ${product.description || ""}
                </p>


                <div
                    class="order-section"
                    style="
                        margin-top:15px;
                        border-top:1px dashed #fae1e6;
                        padding-top:12px;
                        display:flex;
                        flex-direction:column;
                        gap:8px;
                    "
                >

                    <p
                        style="
                            font-weight:700;
                            color:#b5838d;
                            margin-bottom:2px;
                            font-size:.95rem;
                        "
                    >
                        للطلب والتواصل 🌸
                    </p>


                    <a
                        href="https://wa.me/201556051932"
                        target="_blank"
                        style="
                            background-color:#25d366;
                            color:white;
                            padding:6px 15px;
                            border-radius:20px;
                            text-decoration:none;
                            font-size:.85rem;
                            font-weight:600;
                            text-align:center;
                        "
                    >
                        تواصل عبر واتساب
                    </a>


                    <a
                        href="https://www.facebook.com/share/g/19DZh5pJpd/"
                        target="_blank"
                        style="
                            background-color:#1877f2;
                            color:white;
                            padding:6px 15px;
                            border-radius:20px;
                            text-decoration:none;
                            font-size:.85rem;
                            font-weight:600;
                            text-align:center;
                        "
                    >
                        زوروا صفحتنا على الفيسبوك
                    </a>

                </div>

            </div>
        `;


        // ===============================
        // زر الحذف للأدمن فقط
        // ===============================

        if (isAdmin) {

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "حذف المنتج";

            deleteButton.className =
                "btn-delete";

            deleteButton.style.cssText = `
                margin-top:10px;
                background-color:#ff6b6b;
                color:white;
                border:none;
                padding:5px 12px;
                border-radius:12px;
                cursor:pointer;
                font-size:.8rem;
                font-weight:600;
            `;


            deleteButton.addEventListener(
                "click",
                async () => {

                    const confirmDelete =
                        confirm(
                            "هل أنتِ متأكدة من حذف هذا المنتج؟"
                        );


                    if (!confirmDelete) {
                        return;
                    }


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


                    alert("تم حذف المنتج بنجاح 🗑️");

                    await renderProducts();
                }
            );


            newCard
                .querySelector(".item-content")
                .appendChild(deleteButton);
        }


        // ===============================
        // تكبير الصورة
        // ===============================

        const image =
            newCard.querySelector(".clickable-img");

        const modal =
            document.getElementById("imageModal");

        const modalImage =
            document.getElementById("modalContent");


        if (image && modal && modalImage) {

            image.addEventListener("click", () => {

                modal.style.display = "block";

                modalImage.src = imageUrl;
            });


            modal.addEventListener("click", () => {

                modal.style.display = "none";

            });
        }


        galleryContainer.appendChild(newCard);
    }


    // ===============================
    // إضافة المنتج
    // ===============================

    const saveProductBtn =
        document.getElementById("save-product");


    if (saveProductBtn) {

        saveProductBtn.addEventListener(
            "click",
            async () => {

                // التأكد من تسجيل الدخول

                const { data: userData } =
                    await supabaseClient.auth.getUser();


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


                const desc =
                    descInput.value.trim();


                const file =
                    imgInput.files[0];


                if (!title || !desc) {

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


                // ===============================
                // رفع الصورة إلى Storage
                // ===============================

                const fileName =
                    Date.now() +
                    "_" +
                    file.name.replace(
                        /[^a-zA-Z0-9.-]/g,
                        "_"
                    );


                const filePath =
                    fileName;


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

                    console.error(uploadError);

                    alert(
                        "فشل رفع الصورة إلى Supabase:\n" +
                        uploadError.message
                    );

                    return;
                }


                // ===============================
                // الحصول على رابط الصورة
                // ===============================

                const { data: publicUrlData } =
                    supabaseClient.storage
                        .from("products")
                        .getPublicUrl(filePath);


                const imageUrl =
                    publicUrlData.publicUrl;


                // ===============================
                // حفظ المنتج في جدول products
                // ===============================

                const { error: insertError } =
                    await supabaseClient
                        .from("products")
                        .insert([
                            {
                                name: title,
                                description: desc,
                                image_url: imageUrl,
                                whatsapp: "201556051932",
                                facebook:
                                    "https://www.facebook.com/share/g/19DZh5pJpd/"
                            }
                        ]);


                if (insertError) {

                    console.error(insertError);

                    alert(
                        "فشل حفظ المنتج:\n" +
                        insertError.message
                    );

                    return;
                }


                // ===============================
                // نجاح
                // ===============================

                alert(
                    "تم نشر المنتج بنجاح ✨"
                );


                titleInput.value = "";

                descInput.value = "";

                imgInput.value = "";


                addForm.style.display = "none";

                addFormBtn.textContent =
                    "+ إضافة منتج جديد";


                await renderProducts();
            }
        );
    }


    // ===============================
    // تشغيل الموقع
    // ===============================

    hideAdminControls();

    await checkUser();

    await renderProducts();

});