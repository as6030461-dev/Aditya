document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       0. INTRO SEQUENCE + PROFILE 3D
    ========================================================= */
    const introScreen = document.getElementById("introScreen");
    if (introScreen) {
        window.setTimeout(() => {
            introScreen.classList.add("intro-exit");
            window.setTimeout(() => introScreen.remove(), 750);
        }, 1900);
    }

    const profile = document.querySelector(".profile-circle");
    if (profile && window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        profile.addEventListener("pointermove", (event) => {
            const rect = profile.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            profile.style.setProperty("--tilt-x", `${(0.5 - py) * 22}deg`);
            profile.style.setProperty("--tilt-y", `${(px - 0.5) * 26}deg`);
            profile.classList.add("is-tilting");
        });
        profile.addEventListener("pointerleave", () => {
            profile.classList.remove("is-tilting");
            profile.style.removeProperty("--tilt-x");
            profile.style.removeProperty("--tilt-y");
        });
    }

    /* =========================================================
       1. NAVBAR
    ========================================================= */
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    function openMenu() {
        if (!navMenu || !menuToggle) return;
        navMenu.classList.add("active");
        menuToggle.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        if (!navMenu || !menuToggle) return;
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            if (navMenu.classList.contains("active")) closeMenu();
            else openMenu();
        });

        navLinks.forEach((link) => link.addEventListener("click", closeMenu));

        document.addEventListener("click", (event) => {
            if (
                navMenu.classList.contains("active") &&
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }

    /* =========================================================
       2. SCROLL REVEAL
    ========================================================= */
    const revealElements = document.querySelectorAll(
        ".reveal, .skill-card, .project-card, .education-card, .contact-card"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }

    /* =========================================================
       3. SKILL CARD 3D TILT
    ========================================================= */
    document.querySelectorAll(".skill-card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* =========================================================
       4. ADITYA AI DOM
    ========================================================= */
    const aiAssistant = document.getElementById("aiAssistant");
    const aiToggle = document.getElementById("aiToggle");
    const aiBox = document.getElementById("aiBox");
    const aiClose = document.getElementById("aiClose");
    const aiClear = document.getElementById("aiClear");
    const aiMessages = document.getElementById("aiMessages");
    const aiSuggestions = document.getElementById("aiSuggestions");
    const aiInput = document.getElementById("aiInput");
    const sendAiBtn = document.getElementById("sendAiBtn");
    const micBtn = document.getElementById("micBtn");

    if (!aiAssistant || !aiToggle || !aiBox || !aiMessages || !aiInput || !sendAiBtn) {
        console.warn("Aditya AI: Required elements not found.");
        return;
    }

    /* =========================================================
       5. ADITYA PORTFOLIO KNOWLEDGE (used only by the offline fallback)
    ========================================================= */
    const AI_KNOWLEDGE = {
        name: "Aditya Kumar",
        role:
            "Diploma Computer Science Engineering student aur aspiring developer jo programming, web development, Android development aur Artificial Intelligence mein interested hain.",
        nexora:
            "Nexora AI ek AI-powered website builder concept hai jiska purpose websites ko generate, customize, preview aur publish karna hai.",
        library:
            "Online Library Management System ek web application hai jisme books ke issue aur return operations ke liye HTML, CSS, JavaScript, PHP aur MySQL ka use kiya gaya hai.",
        chat:
            "Chat Application Python client-server sockets par based real-time communication concept hai.",
        education:
            "Aditya Kumar Diploma in Computer Science Engineering kar rahe hain at Centurion University of Technology and Management. CGPA: 8.0/10.",
        contact:
            "Aditya se contact karne ke liye portfolio ke Contact section mein Email aur WhatsApp options available hain."
    };

    /* =========================================================
       6. HELPER FUNCTIONS
    ========================================================= */
    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .replace(/[^\w\s+#.-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Whole-word match, so "hi" does not match "which" and "java" does not match "javascript"
    function containsAny(text, words) {
        const normalized = ` ${normalizeText(text)} `;
        return words.some((word) => normalized.includes(` ${normalizeText(word)} `));
    }

    function escapeHTML(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatAnswer(text) {
        let safe = escapeHTML(text);
        safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        safe = safe.replace(/\n/g, "<br>");
        return safe;
    }

    function cleanForSpeech(text) {
        return String(text || "")
            .replace(/<[^>]*>/g, "")
            .replace(/\*\*/g, "")
            .replace(/[#*_`]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    /* =========================================================
       7. LOCAL INTENT DETECTION (offline fallback only)
    ========================================================= */
    function detectIntent(question) {
        const q = normalizeText(question);

        if (containsAny(q, ["hello", "hi", "hey", "hii", "namaste", "good morning", "good afternoon", "good evening"])) return "greeting";
        if (containsAny(q, ["who are you", "tum kaun ho", "aap kaun ho", "aditya kaun hai", "who is aditya"])) return "identity";
        if (containsAny(q, ["thank you", "thanks", "dhanyavad", "shukriya"])) return "thanks";
        if (containsAny(q, ["bye", "goodbye", "see you", "milte hain"])) return "goodbye";
        if (containsAny(q, ["skill", "skills", "technology", "technologies", "language", "languages"])) return "skills";
        if (containsAny(q, ["html", "css", "javascript", "web development", "website"])) return "web";
        if (containsAny(q, ["java"])) return "java";
        if (containsAny(q, ["python"])) return "python";
        if (containsAny(q, ["mysql", "sql", "database"])) return "mysql";
        if (containsAny(q, ["project", "projects"])) return "projects";
        if (containsAny(q, ["nexora", "nexora ai"])) return "nexora";
        if (containsAny(q, ["library", "library management", "online library"])) return "library";
        if (containsAny(q, ["chat application", "chat app", "socket"])) return "chat";
        if (containsAny(q, ["education", "study", "college", "university", "degree", "diploma", "cgpa"])) return "education";
        if (containsAny(q, ["contact", "email", "mail", "whatsapp", "phone"])) return "contact";
        if (containsAny(q, ["about", "about aditya", "aditya ke baare", "aditya kya"])) return "about";
        if (containsAny(q, ["help", "what can you do", "kya kar sakte ho"])) return "help";
        if (containsAny(q, ["resume", "cv"])) return "resume";

        return "unknown";
    }

    /* =========================================================
       8. LOCAL FALLBACK ANSWERS (offline fallback only)
    ========================================================= */
    function getAdityaAnswer(question) {
        const intent = detectIntent(question);

        switch (intent) {
            case "greeting":
                return {
                    text: "👋 Hey! Main Aditya AI hoon. Aap mujhse kuch bhi pooch sakte ho — Aditya ke baare mein ya koi bhi general question.",
                    speech: "Hey! Main Aditya AI hoon. Aap mujhse kuch bhi pooch sakte ho."
                };
            case "identity":
                return {
                    text: `👤 **${AI_KNOWLEDGE.name}** ek ${AI_KNOWLEDGE.role}`,
                    speech: `${AI_KNOWLEDGE.name} ek Diploma Computer Science Engineering student aur aspiring developer hain.`
                };
            case "about":
                return {
                    text: `👤 **${AI_KNOWLEDGE.name}** ek ${AI_KNOWLEDGE.role}`,
                    speech: "Aditya Kumar ek Diploma Computer Science Engineering student aur aspiring developer hain."
                };
            case "skills":
                return {
                    text: "💻 **Aditya ki skills:**\n\n• C Programming\n• C++\n• Java\n• Python\n• HTML\n• CSS\n• JavaScript\n• SQL\n• MySQL",
                    speech: "Aditya ki skills hain C Programming, C plus plus, Java, Python, HTML, CSS, JavaScript, SQL aur MySQL."
                };
            case "java":
                return {
                    text: "☕ Aditya ke listed skills mein **Java** bhi included hai.",
                    speech: "Aditya ke listed skills mein Java bhi included hai."
                };
            case "web":
                return {
                    text: "🌐 Aditya ke web-development skills mein **HTML, CSS aur JavaScript** included hain.",
                    speech: "Aditya ke web development skills mein HTML, CSS aur JavaScript included hain."
                };
            case "python":
                return {
                    text: "🐍 **Python** Aditya ki listed programming skills mein included hai. Unka Chat Application Python client-server sockets par based hai.",
                    speech: "Python Aditya ki listed programming skills mein included hai."
                };
            case "mysql":
                return {
                    text: "🗄️ **SQL/MySQL** Aditya ki listed skills mein included hain. Online Library Management System mein MySQL ka use kiya gaya hai.",
                    speech: "SQL aur MySQL Aditya ki listed skills mein included hain."
                };
            case "projects":
                return {
                    text: "🚀 **Aditya ke projects:**\n\n• Nexora AI\n• Online Library Management System\n• Chat Application",
                    speech: "Aditya ke projects hain Nexora AI, Online Library Management System aur Chat Application."
                };
            case "nexora":
                return {
                    text: `🚀 **Nexora AI**\n\n${AI_KNOWLEDGE.nexora}`,
                    speech: "Nexora AI ek AI powered website builder concept hai."
                };
            case "library":
                return {
                    text: `📚 **Online Library Management System**\n\n${AI_KNOWLEDGE.library}`,
                    speech: "Online Library Management System books ke issue aur return operations ke liye ek web application hai."
                };
            case "chat":
                return {
                    text: `💬 **Chat Application**\n\n${AI_KNOWLEDGE.chat}`,
                    speech: "Chat Application Python client server sockets par based real time communication concept hai."
                };
            case "education":
                return {
                    text: `🎓 **Education**\n\n${AI_KNOWLEDGE.education}`,
                    speech: "Aditya Diploma in Computer Science Engineering kar rahe hain at Centurion University of Technology and Management."
                };
            case "contact":
                return {
                    text: `📩 **Contact**\n\n${AI_KNOWLEDGE.contact}`,
                    speech: "Aditya se contact karne ke liye portfolio ke Contact section mein Email aur WhatsApp options available hain."
                };
            case "help":
                return {
                    text: "🤖 Main kisi bhi topic ke questions answer kar sakta hoon, aur Aditya ke **skills, projects, education, contact details** ke baare mein bhi bata sakta hoon.",
                    speech: "Main kisi bhi topic ke questions answer kar sakta hoon, aur Aditya ke baare mein bhi bata sakta hoon."
                };
            case "resume":
                return {
                    text: "📄 Portfolio ke Home section mein **Download Resume** button available hai.",
                    speech: "Portfolio ke Home section mein Download Resume button available hai."
                };
            case "thanks":
                return { text: "😊 You're welcome!", speech: "You're welcome!" };
            case "goodbye":
                return {
                    text: "👋 Bye! Portfolio explore karte raho.",
                    speech: "Bye! Portfolio explore karte raho."
                };
            default:
                return {
                    text: "🤖 Abhi AI server se connect nahi ho paa raha.",
                    speech: "Abhi AI server se connect nahi ho paa raha."
                };
        }
    }

    /* =========================================================
       9. CHAT HISTORY
       The system prompt now lives on the server (server.js).
    ========================================================= */
    let chatHistory = [];

    /* =========================================================
       10. CHAT UI
    ========================================================= */
    function scrollMessagesToBottom() {
        requestAnimationFrame(() => {
            aiMessages.scrollTop = aiMessages.scrollHeight;
        });
    }

    function addMessage(text, sender = "bot", options = {}) {
        const message = document.createElement("div");
        message.className = `ai-message ${sender === "user" ? "user" : "bot"}`;

        if (sender === "user") {
            message.innerHTML = `
                <div class="ai-bubble">
                    <div class="ai-message-text">${formatAnswer(text)}</div>
                </div>
            `;
        } else {
            message.innerHTML = `
                <div class="ai-avatar-small">AI</div>
                <div class="ai-bubble">
                    <div class="ai-message-name">Aditya AI</div>
                    <div class="ai-message-text">${formatAnswer(text)}</div>
                </div>
            `;
        }

        aiMessages.appendChild(message);
        scrollMessagesToBottom();

        if (sender === "bot" && options.speech) {
            speakText(options.speech);
        }

        return message;
    }

    function showTyping() {
        if (document.getElementById("aiTyping")) return;

        const typing = document.createElement("div");
        typing.className = "ai-message bot";
        typing.id = "aiTyping";
        typing.innerHTML = `
            <div class="ai-avatar-small">AI</div>
            <div class="ai-bubble">
                <div class="ai-message-name">Aditya AI</div>
                <div class="ai-typing"><span></span><span></span><span></span></div>
            </div>
        `;

        aiMessages.appendChild(typing);
        scrollMessagesToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById("aiTyping");
        if (typing) typing.remove();
    }

    /* =========================================================
       11. OPEN / CLOSE AI
    ========================================================= */
    function openAI() {
        aiAssistant.classList.add("active");
        aiBox.classList.add("active");
        aiBox.setAttribute("aria-hidden", "false");
        aiToggle.setAttribute("aria-expanded", "true");

        aiBox.style.display = "flex";
        aiBox.style.opacity = "1";
        aiBox.style.visibility = "visible";
        aiBox.style.pointerEvents = "auto";
        aiBox.style.transform = "translateY(0) scale(1)";

        setTimeout(() => aiInput.focus(), 100);
        scrollMessagesToBottom();
    }

    function closeAI() {
        aiAssistant.classList.remove("active");
        aiBox.classList.remove("active");
        aiBox.setAttribute("aria-hidden", "true");
        aiToggle.setAttribute("aria-expanded", "false");

        aiBox.style.display = "";
        aiBox.style.opacity = "";
        aiBox.style.visibility = "";
        aiBox.style.pointerEvents = "";
        aiBox.style.transform = "";
    }

    aiToggle.addEventListener("click", () => {
        if (aiAssistant.classList.contains("active")) closeAI();
        else openAI();
    });

    if (aiClose) aiClose.addEventListener("click", closeAI);

    /* =========================================================
       12. CLEAR CHAT
    ========================================================= */
    function resetChat() {
        aiMessages.innerHTML = `
            <div class="ai-message bot">
                <div class="ai-avatar-small">AI</div>
                <div class="ai-bubble">
                    <div class="ai-message-name">Aditya AI</div>
                    <div class="ai-message-text">
                        👋 Hey! I'm Aditya AI.
                        <br><br>
                        Mujhse kuch bhi pooch sakte ho — coding, studies, general knowledge,
                        ya Aditya ke skills, projects, education aur contact ke baare mein.
                    </div>
                </div>
            </div>
        `;

        chatHistory = [];

        if (window.speechSynthesis) window.speechSynthesis.cancel();
        scrollMessagesToBottom();
    }

    if (aiClear) aiClear.addEventListener("click", resetChat);

    /* =========================================================
       13. AI REQUEST (via our Node.js backend -> Groq)
    ========================================================= */
    async function askGroq(question) {
        chatHistory.push({ role: "user", content: question });

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: chatHistory.slice(-16) })
            });

            let data;
            try {
                data = await response.json();
            } catch (_) {
                throw new Error(
                    "AI server is not reachable. Run `node server.js` and open http://localhost:3000"
                );
            }

            if (!response.ok) {
                throw new Error(data.error || `AI request failed (${response.status}).`);
            }

            const answer = String(data.message || "").trim();
            if (!answer) throw new Error("AI returned an empty response.");

            chatHistory.push({ role: "assistant", content: answer });
            return answer;
        } catch (error) {
            chatHistory.pop(); // do not keep the failed question in history
            throw error;
        }
    }

    /* =========================================================
       14. MAIN ASK AI FUNCTION
    ========================================================= */
    async function askAI(question) {
        const cleanQuestion = String(question || "").trim();
        if (!cleanQuestion) return;

        addMessage(cleanQuestion, "user");

        aiInput.value = "";
        aiInput.style.height = "auto";

        sendAiBtn.disabled = true;
        if (micBtn) micBtn.disabled = true;

        showTyping();

        try {
            const answer = await askGroq(cleanQuestion);
            removeTyping();
            addMessage(answer, "bot", { speech: answer });
        } catch (error) {
            console.error("Aditya AI / Groq Error:", error);
            removeTyping();

            // Offline fallback: known Aditya questions still get an answer,
            // anything else shows the real error so it can be fixed.
            const intent = detectIntent(cleanQuestion);
            if (intent !== "unknown") {
                const fallback = getAdityaAnswer(cleanQuestion);
                addMessage(fallback.text, "bot", { speech: fallback.speech });
            } else {
                addMessage(`⚠️ ${error.message}`, "bot");
            }
        } finally {
            sendAiBtn.disabled = false;
            if (micBtn && !micBtn.dataset.unsupported) micBtn.disabled = false;
            aiInput.focus();
        }
    }

    /* =========================================================
       15. SEND BUTTON + ENTER KEY
    ========================================================= */
    sendAiBtn.addEventListener("click", () => askAI(aiInput.value));

    aiInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!sendAiBtn.disabled) askAI(aiInput.value);
        }
    });

    /* =========================================================
       16. TEXTAREA AUTO RESIZE
    ========================================================= */
    aiInput.addEventListener("input", () => {
        aiInput.style.height = "auto";
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + "px";
    });

    /* =========================================================
       17. SUGGESTION BUTTONS
    ========================================================= */
    if (aiSuggestions) {
        aiSuggestions.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                const question = button.getAttribute("data-question");
                if (!question) return;
                askAI(question);
            });
        });
    }

    /* =========================================================
       18. SPEECH SYNTHESIS
    ========================================================= */
    function speakText(text) {
        if (!window.speechSynthesis) return;

        const cleanText = cleanForSpeech(text);
        if (!cleanText) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "en-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }

    /* =========================================================
       19. SPEECH RECOGNITION
    ========================================================= */
    let recognition = null;
    let isListening = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && micBtn) {
        recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isListening = true;
            micBtn.classList.add("listening");
            micBtn.setAttribute("aria-label", "Stop voice input");
            micBtn.title = "Listening...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript || "";
            if (transcript.trim()) {
                aiInput.value = transcript.trim();
                aiInput.dispatchEvent(new Event("input"));
                askAI(transcript.trim());
            }
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            isListening = false;
            micBtn.classList.remove("listening");
            micBtn.setAttribute("aria-label", "Voice input");
            micBtn.title = "Voice input";
        };

        micBtn.addEventListener("click", () => {
            if (isListening) {
                recognition.stop();
                return;
            }
            try {
                recognition.start();
            } catch (error) {
                console.warn("Speech recognition could not start:", error);
            }
        });
    } else if (micBtn) {
        micBtn.disabled = true;
        micBtn.dataset.unsupported = "true";
        micBtn.title = "Voice input is not supported in this browser";
    }

    /* =========================================================
       20. INITIAL ARIA STATE + ESCAPE KEY
    ========================================================= */
    aiBox.setAttribute("aria-hidden", "true");
    aiToggle.setAttribute("aria-expanded", "false");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && aiAssistant.classList.contains("active")) {
            closeAI();
        }
    });

    console.log("%cAditya AI initialized", "font-weight: bold;");
});
