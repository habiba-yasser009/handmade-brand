const SUPABASE_URL = "https://xqsdrgtlkwpzzstoches.supabase.co";
const SUPABASE_KEY = "sb_publishable_a-DKrUN4Dj8Xq14m3sNvfQ_RWp1YaII";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // شاشة الترحيب
    // =========================

    const introScreen = document.getElementById("intro-screen");
    const fadeElements = document.querySelectorAll(".fade-element");

    setTimeout(() => {

        if (introScreen) {
            introScreen.style.opacity = "0";
            introScreen.style.visibility = "hidden";
        }

        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("show");
            }, index * 200);
        });

    }, 2000);


    // =========================
    // عناصر الصفحة
    // =========================

    const showAddFormBtn =
        document.getElementById("show-add-form");

    const addProductForm =
        document.getElementById("add-product-form");

    const saveProductBtn =
        document.getElementById("save-product");

    const galleryContainer =
        document.getElementById("gallery-container");


    // =========================
    // فتح وإغلاق نموذج إضافة المنتج
    // =========================

    if (showAddFormBtn && addProductForm) {

        showAddFormBtn.addEventListener("click", () => {

            if (
                addProductForm.style.display === "none" ||
                addProductForm.style.display === ""
            ) {

                addProductForm.style.display = "block";

                showAddFormBtn.textContent =
                    "إغلاق النموذج";

            } else {

                addProductForm.style.display = "none";

                showAddFormBtn.textContent =
                    "+ إضافة منتج جديد للبراند";
            }

        });

    }


    // =========================
    // تحميل المنتجات من Supabase
    // =========================

    async function loadProducts() {

        if (!galleryContainer) return;

        galleryContainer.innerHTML = "";

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error("LOAD ERROR:", error);

            galleryContainer.innerHTML = `
                <p style="
                    text-align:center;
                    color:#b5838d;
                    grid-column:1/-1;
                ">
                    حدث خطأ أثناء تحميل المنتجات.
                </p>
            `;

            return;
        }


        if (!data || data.length === 0) {

            galleryContainer.innerHTML = `
                <p style="
                    text-align:center;
                    color:#b5838d;
                    grid-column:1/-1;
                ">
                    لا توجد منتجات مضافة حتى الآن ✨
                </p>
            `;

            return;
        }


        data.forEach((product) => {
            createProductCard(product);
        });

    }


    // =========================
    // إنشاء كارت المنتج
    // =========================

    function createProductCard(product) {

        const newCard =
            document.createElement("div");

        newCard.className =
            "gallery-item fade-element show";


        const imgSrc =
            product.image_url || "ms.png";


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
                    src="${imgSrc}"
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
                    ${product.name || ""}
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


                    <button
                        class="btn-delete"
                        style="
                            margin-top:10px;
                            background-color:#ff6b6b;
                            color:white;
                            border:none;
                            padding:5px 12px;
                            border-radius:12px;
                            cursor:pointer;
                            font-size:.8rem;
                            font-weight:600;
                        "
                    >
                        حذف المنتج
                    </button>

                </div>

            </div>
        `;


        // =========================
        // تكبير الصورة
        // =========================

        const imgElement =
            newCard.querySelector(".clickable-img");

        const modal =
            document.getElementById("imageModal");

        const modalImg =
            document.getElementById("modalContent");


        if (imgElement && modal && modalImg) {

            imgElement.addEventListener("click", () => {

                modal.style.display = "block";

                modalImg.src = imgSrc;

            });

        }


        if (modal) {

            modal.addEventListener("click", () => {

                modal.style.display = "none";

            });

        }


        // =========================
        // حذف المنتج
        // =========================

        const deleteBtn =
            newCard.querySelector(".btn-delete");


        if (deleteBtn) {

            deleteBtn.addEventListener(
                "click",
                async () => {

                    const confirmDelete =
                        confirm(
                            "هل أنتِ متأكدة من حذف هذا المنتج من الموقع؟"
                        );


                    if (!confirmDelete) return;


                    const { error } =
                        await supabaseClient
                            .from("products")
                            .delete()
                            .eq("id", product.id);


                    if (error) {

                        console.error(
                            "DELETE ERROR:",
                            error
                        );

                        alert(error.message);

                        return;
                    }


                    alert(
                        "تم حذف المنتج بنجاح 🗑️"
                    );


                    loadProducts();

                }
            );

        }


        galleryContainer.appendChild(newCard);

    }


    // =========================
    // إضافة منتج
    // =========================

    if (saveProductBtn) {

        saveProductBtn.addEventListener(
            "click",
            async () => {

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


                // =========================
                // التحقق من البيانات
                // =========================

                if (!title) {

                    alert(
                        "من فضلك اكتبي اسم المنتج."
                    );

                    return;
                }


                if (!desc) {

                    alert(
                        "من فضلك اكتبي وصف المنتج."
                    );

                    return;
                }


                if (!file) {

                    alert(
                        "من فضلك اختاري صورة للمنتج."
                    );

                    return;
                }


                if (file.size > 5 * 1024 * 1024) {

                    alert(
                        "حجم الصورة يجب أن يكون أقل من 5MB."
                    );

                    return;
                }


                saveProductBtn.disabled = true;

                saveProductBtn.textContent =
                    "جاري النشر...";


                try {

                    // =========================
                    // رفع الصورة إلى Storage
                    // =========================

                    const fileExtension =
                        file.name
                            .split(".")
                            .pop();


                    const fileName =
                        `${Date.now()}-${Math.random()
                            .toString(36)
                            .substring(2)}.${fileExtension}`;


                    const { error: uploadError } =
                        await supabaseClient
                            .storage
                            .from("products")
                            .upload(
                                fileName,
                                file,
                                {
                                    cacheControl: "3600",
                                    upsert: false
                                }
                            );


                    if (uploadError) {

                        console.error(
                            "UPLOAD ERROR:",
                            uploadError
                        );

                        alert(
                            "خطأ رفع الصورة: " +
                            uploadError.message
                        );

                        return;
                    }


                    // =========================
                    // رابط الصورة
                    // =========================

                    const { data: publicUrlData } =
                        supabaseClient
                            .storage
                            .from("products")
                            .getPublicUrl(
                                fileName
                            );


                    const imageUrl =
                        publicUrlData.publicUrl;


                    console.log(
                        "IMAGE URL:",
                        imageUrl
                    );


                    // =========================
                    // حفظ المنتج في الجدول
                    // =========================

                    const { error: insertError } =
                        await supabaseClient
                            .from("products")
                            .insert([
                                {
                                    name: title,
                                    description: desc,
                                    image_url: imageUrl
                                }
                            ]);


                    // =========================
                    // إظهار الخطأ الحقيقي
                    // =========================

                    if (insertError) {

                        console.error(
                            "INSERT ERROR:",
                            insertError
                        );

                        alert(
                            "خطأ حفظ المنتج:\n\n" +
                            insertError.message
                        );

                        return;
                    }


                    // =========================
                    // نجاح العملية
                    // =========================

                    titleInput.value = "";

                    descInput.value = "";

                    imgInput.value = "";


                    addProductForm.style.display =
                        "none";


                    showAddFormBtn.textContent =
                        "+ إضافة منتج جديد للبراند";


                    alert(
                        "تم نشر المنتج بنجاح! ✨"
                    );


                    loadProducts();

                }

                catch (error) {

                    console.error(
                        "GENERAL ERROR:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

                finally {

                    saveProductBtn.disabled =
                        false;

                    saveProductBtn.textContent =
                        "نشر في الموقع فوراً";

                }

            }
        );

    }


    // =========================
    // تشغيل الموقع
    // =========================

    loadProducts();

});