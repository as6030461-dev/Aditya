/* =========================================================
   ADITYA AI — COMPLETE PORTFOLIO ASSISTANT
   No API / No external AI service required
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const aiToggle = document.getElementById("aiToggle");
    const aiBox = document.getElementById("aiBox");
    const aiClose = document.getElementById("aiClose");
    const aiClear = document.getElementById("aiClear");

    const aiInput = document.getElementById("aiInput");
    const sendAiBtn = document.getElementById("sendAiBtn");
    const micBtn = document.getElementById("micBtn");

    const aiMessages = document.getElementById("aiMessages");
    const aiSuggestions = document.getElementById("aiSuggestions");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (
        !aiToggle ||
        !aiBox ||
        !aiClose ||
        !aiInput ||
        !sendAiBtn ||
        !micBtn ||
        !aiMessages
    ) {
        console.warn("Aditya AI: Required AI elements not found.");
        return;
    }


    /* =====================================================
       AI KNOWLEDGE
    ===================================================== */

    const AI_KNOWLEDGE = {

        name: "Aditya Kumar",

        role:
            "Developer aur programmer jo web development aur programming technologies par kaam karte hain.",

        skills: [
            "C",
            "C++",
            "Java",
            "Python",
            "HTML",
            "CSS",
            "JavaScript",
            "MySQL",
            "Web Development"
        ],

        projects: [
            "Nexora AI",
            "Online Library Management System",
            "Chat Application"
        ],

        nexora:
            "Nexora AI ek AI-powered website builder project hai jisme websites ko generate, customize, preview aur publish karne ka concept hai.",

        library:
            "Online Library Management System ek web application hai jo books ke issue aur return ko manage karne ke liye banaya gaya hai.",

        chat:
            "Chat Application Python-based client-server application hai jo sockets ka use karke real-time communication provide karti hai.",

        education:
            "Aditya Diploma in Computer Science Engineering kar rahe hain at Centurion University of Technology and Management.",

        contact:
            "Aditya se contact karne ke liye portfolio ke Contact section mein Email aur WhatsApp options available hain."

    };


    /* =====================================================
       STATE
    ===================================================== */

    let isTyping = false;
    let recognition = null;
    let isListening = false;


    /* =====================================================
       NORMALIZE TEXT
    ===================================================== */

    function normalize(text) {

        let value = String(text || "")
            .toLowerCase()
            .trim();

        /* Remove punctuation */
        value = value.replace(/[?!.,;:'"`()[\]{}]/g, " ");

        /* Common Hinglish shortcuts */
        value = value
            .replace(/\bmai\b/g, "main")
            .replace(/\bme\b/g, "main")
            .replace(/\bmera\b/g, "mera")
            .replace(/\bmeri\b/g, "meri")
            .replace(/\bmere\b/g, "mere")
            .replace(/\bbaare\b/g, "bare")
            .replace(/\bbaray\b/g, "bare")
            .replace(/\bkr\b/g, "kar")
            .replace(/\bkro\b/g, "karo")
            .replace(/\bbta\b/g, "bata")
            .replace(/\bbtao\b/g, "batao")
            .replace(/\bkyaaa\b/g, "kya")
            .replace(/\bpls\b/g, "please")
            .replace(/\bplz\b/g, "please");

        /* Repeated characters */
        value = value.replace(/([a-z])\1{2,}/g, "$1$1");

        /* Extra spaces */
        value = value.replace(/\s+/g, " ");

        return value.trim();
    }


    /* =====================================================
       ESCAPE REGEX
    ===================================================== */

    function escapeRegExp(text) {

        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    }


    /* =====================================================
       MATCH WORD / PHRASE
    ===================================================== */

    function containsAny(text, phrases) {

        return phrases.some(function (phrase) {

            phrase = normalize(phrase);

            if (phrase.includes(" ")) {
                return text.includes(phrase);
            }

            const regex = new RegExp(
                "(^|\\s)" + escapeRegExp(phrase) + "(\\s|$)"
            );

            return regex.test(text);

        });

    }


    /* =====================================================
       GREETING DETECTION
    ===================================================== */

    function isGreeting(q) {

        if (
            /^(h+i+)$/.test(q) ||
            /^(h+e+l+l+o+)$/.test(q) ||
            /^(h+e+y+)$/.test(q) ||
            /^(h+y+)$/.test(q) ||
            /^(y+o+)$/.test(q)
        ) {
            return true;
        }

        return containsAny(q, [
            "hello",
            "hi",
            "hii",
            "hiii",
            "hey",
            "heyy",
            "namaste",
            "hola",
            "good morning",
            "good afternoon",
            "good evening"
        ]);
    }


    /* =====================================================
       INTENT DETECTION
    ===================================================== */

    function detectIntent(question) {

        const q = normalize(question);


        /* Greeting */

        if (isGreeting(q)) {
            return "greeting";
        }


        /* Identity */

        if (
            q.includes("main aditya hu") ||
            q.includes("main aditya hoon") ||
            q.includes("main hi aditya hu") ||
            q.includes("mera naam aditya hai") ||
            q.includes("i am aditya") ||
            q.includes("i m aditya") ||
            q.includes("im aditya")
        ) {
            return "identity";
        }


        /* Thanks */

        if (
            containsAny(q, [
                "thanks",
                "thank",
                "thank you",
                "thankyou",
                "dhanyawad",
                "shukriya"
            ])
        ) {
            return "thanks";
        }


        /* Goodbye */

        if (
            containsAny(q, [
                "bye",
                "goodbye",
                "see you",
                "milte hain",
                "chalta hu",
                "chalta hoon"
            ])
        ) {
            return "goodbye";
        }


        /* Help */

        if (
            containsAny(q, [
                "help",
                "what can you do",
                "what do you do",
                "kya kar sakte ho",
                "kya kya bata sakte ho",
                "tum kya kar sakte",
                "tum kya karte ho"
            ])
        ) {
            return "help";
        }


        /* About */

        if (
            containsAny(q, [
                "who is aditya",
                "who am i",
                "who i am",
                "about aditya",
                "about me",
                "mere bare me",
                "mere baare me",
                "mere bare mein",
                "mere baare mein",
                "mera introduction",
                "apna introduction",
                "aditya kaun hai",
                "main kaun hu",
                "mai kaun hu",
                "tell me about aditya",
                "tell me about me",
                "aditya ke bare me",
                "aditya ke baare me"
            ])
        ) {
            return "about";
        }


        /* Projects */

        if (
            containsAny(q, [
                "project",
                "projects",
                "my projects",
                "portfolio project",
                "kya banaya",
                "kya banaye",
                "maine kya banaya",
                "maine kya banaya hai",
                "aditya ne kya banaya",
                "mere projects",
                "aditya ke projects",
                "uske projects",
                "tumhare projects",
                "tumne kya banaya",
                "what did you build",
                "what have you built"
            ])
        ) {
            return "projects";
        }


        /* Nexora */

        if (
            containsAny(q, [
                "nexora",
                "nexora ai",
                "nexora project",
                "nexora kya hai",
                "what is nexora",
                "tell me about nexora"
            ])
        ) {
            return "nexora";
        }


        /* Library */

        if (
            containsAny(q, [
                "library",
                "online library",
                "library management",
                "library project",
                "book management",
                "books project"
            ])
        ) {
            return "library";
        }


        /* Chat */

        if (
            containsAny(q, [
                "chat application",
                "chat app",
                "chat project",
                "messaging app",
                "messaging project"
            ])
        ) {
            return "chat";
        }


        /* Education */

        if (
            containsAny(q, [
                "education",
                "study",
                "studies",
                "qualification",
                "degree",
                "college",
                "school",
                "padhai",
                "padhaai",
                "kaha padha",
                "kahan padha",
                "education kya hai",
                "aditya ki education",
                "meri education"
            ])
        ) {
            return "education";
        }


        /* Contact */

        if (
            containsAny(q, [
                "contact",
                "email",
                "mail",
                "reach",
                "connect",
                "contact kaise",
                "contact karna",
                "aditya se contact",
                "aditya se kaise baat",
                "kaise contact kare",
                "contact details"
            ])
        ) {
            return "contact";
        }


        /* Skills */

        if (
            containsAny(q, [
                "skill",
                "skills",
                "technology",
                "technologies",
                "tech",
                "tech stack",
                "programming",
                "coding",
                "language",
                "languages",
                "kya aata hai",
                "kya kya aata hai",
                "kya kar sakta",
                "kaunsi technology",
                "kaun si technology",
                "meri skills",
                "aditya ki skills",
                "uski skills",
                "tumhari skills",
                "aditya ko kya aata"
            ])
        ) {
            return "skills";
        }


        /* Java */

        if (
            containsAny(q, [
                "java",
                "java aati",
                "java aata",
                "java janta",
                "java knowledge"
            ])
        ) {
            return "java";
        }


        /* Python */

        if (
            containsAny(q, [
                "python",
                "python aati",
                "python aata"
            ])
        ) {
            return "python";
        }


        /* MySQL */

        if (
            containsAny(q, [
                "mysql",
                "database",
                "sql"
            ])
        ) {
            return "mysql";
        }


        /* Web */

        if (
            containsAny(q, [
                "html",
                "css",
                "javascript",
                "js",
                "web development",
                "web developer",
                "website"
            ])
        ) {
            return "web";
        }


        /* Resume */

        if (
            containsAny(q, [
                "resume",
                "cv",
                "curriculum vitae"
            ])
        ) {
            return "resume";
        }


        return "unknown";
    }


    /* =====================================================
       ANSWER ENGINE
    ===================================================== */

    function getAdityaAnswer(question) {

        const intent = detectIntent(question);


        switch (intent) {

            case "greeting":

                return {
                    text:
                        "👋 Hello! Welcome to Aditya's portfolio.\n\n" +
                        "Main Aditya AI hoon. Aap mujhse Aditya ke skills, projects, education, Nexora AI, resume ya contact ke baare mein pooch sakte ho.",

                    speech:
                        "Hello! Welcome to Aditya's portfolio. Main Aditya AI hoon."
                };


            case "identity":

                return {
                    text:
                        "😄 Haan, samajh gaya — aap Aditya ho!\n\n" +
                        "Ye portfolio Aditya Kumar ka hai. Main aapke portfolio ka personal AI assistant hoon.",

                    speech:
                        "Haan, samajh gaya. Aap Aditya ho. Ye portfolio Aditya Kumar ka hai."
                };


            case "about":

                return {
                    text:
                        "👤 Aditya Kumar\n\n" +
                        AI_KNOWLEDGE.role +
                        "\n\n" +
                        "Is portfolio mein aap Aditya ki skills, projects, education aur contact information explore kar sakte ho.",

                    speech:
                        "Aditya Kumar developer aur programmer hain jo web development aur programming technologies par kaam karte hain."
                };


            case "skills":

                return {
                    text:
                        "💻 Aditya ki Technical Skills\n\n" +
                        "• C\n" +
                        "• C++\n" +
                        "• Java\n" +
                        "• Python\n" +
                        "• HTML\n" +
                        "• CSS\n" +
                        "• JavaScript\n" +
                        "• MySQL\n" +
                        "• Web Development",

                    speech:
                        "Aditya ki skills mein C, C plus plus, Java, Python, HTML, CSS, JavaScript, MySQL aur web development shamil hain."
                };


            case "java":

                return {
                    text:
                        "☕ Haan. Java Aditya ki technical skills mein included hai.",

                    speech:
                        "Haan. Java Aditya ki technical skills mein included hai."
                };


            case "python":

                return {
                    text:
                        "🐍 Haan. Python bhi Aditya ki technical skills mein included hai.",

                    speech:
                        "Haan. Python bhi Aditya ki technical skills mein included hai."
                };


            case "mysql":

                return {
                    text:
                        "🗄️ Haan. MySQL bhi Aditya ke technical stack ka part hai.",

                    speech:
                        "Haan. MySQL bhi Aditya ke technical stack ka part hai."
                };


            case "web":

                return {
                    text:
                        "🌐 Aditya HTML, CSS aur JavaScript ke saath web development par kaam karte hain.",

                    speech:
                        "Aditya HTML, CSS aur JavaScript ke saath web development par kaam karte hain."
                };


            case "projects":

                return {
                    text:
                        "🚀 Aditya ke Projects\n\n" +
                        "1. 🤖 Nexora AI\n" +
                        "2. 📚 Online Library Management System\n" +
                        "3. 💬 Chat Application\n\n" +
                        "Aap kisi specific project ke baare mein bhi pooch sakte ho.",

                    speech:
                        "Aditya ke projects hain Nexora AI, Online Library Management System aur Chat Application."
                };


            case "nexora":

                return {
                    text:
                        "🤖 Nexora AI\n\n" +
                        AI_KNOWLEDGE.nexora,

                    speech:
                        "Nexora AI ek AI powered website builder project hai jisme websites ko generate, customize, preview aur publish karne ka concept hai."
                };


            case "library":

                return {
                    text:
                        "📚 Online Library Management System\n\n" +
                        AI_KNOWLEDGE.library,

                    speech:
                        "Online Library Management System books ke issue aur return ko manage karne ke liye banaya gaya web application hai."
                };


            case "chat":

                return {
                    text:
                        "💬 Chat Application\n\n" +
                        AI_KNOWLEDGE.chat,

                    speech:
                        "Chat Application Python based client server application hai jo sockets ka use karti hai."
                };


            case "education":

                return {
                    text:
                        "🎓 Education\n\n" +
                        AI_KNOWLEDGE.education,

                    speech:
                        "Aditya Diploma in Computer Science Engineering kar rahe hain at Centurion University of Technology and Management."
                };


            case "contact":

                return {
                    text:
                        "📩 Contact Aditya\n\n" +
                        AI_KNOWLEDGE.contact,

                    speech:
                        "Aditya se contact karne ke liye portfolio ke Contact section mein Email aur WhatsApp options available hain."
                };


            case "resume":

                return {
                    text:
                        "📄 Resume\n\n" +
                        "Aditya ka Resume portfolio ke Download Resume button se download kiya ja sakta hai.",

                    speech:
                        "Aditya ka resume portfolio ke Download Resume button se download kiya ja sakta hai."
                };


            case "help":

                return {
                    text:
                        "✨ Main aapki help kar sakta hoon.\n\n" +
                        "Aap pooch sakte ho:\n" +
                        "• Aditya kaun hai?\n" +
                        "• Aditya ki skills kya hain?\n" +
                        "• Aditya ke projects kya hain?\n" +
                        "• Nexora AI kya hai?\n" +
                        "• Library project kya hai?\n" +
                        "• Education batao\n" +
                        "• Resume batao\n" +
                        "• Aditya se contact kaise kare?",

                    speech:
                        "Main Aditya ke baare mein information de sakta hoon, jaise skills, projects, education, resume aur contact."
                };

                case "thanks":

                return {
                    text:
                        "😊 You're welcome, Aditya!",

                    speech:
                        "You're welcome, Aditya!"
                };


            case "goodbye":

                return {
                    text:
                        "👋 Bye! Portfolio explore karte raho. See you!",

                    speech:
                        "Bye! Portfolio explore karte raho. See you!"
                };


            default:

                return {
                    text:
                        "🤔 Hmm, mujhe is question ka exact answer portfolio information mein nahi mila.\n\n" +
                        "Aap Aditya ki skills, projects, Nexora AI, Library Management System, Chat Application, education, resume ya contact ke baare mein pooch sakte ho.",

                    speech:
                        "Mujhe is question ka exact answer portfolio information mein nahi mila. Aap Aditya ki skills, projects, education ya contact ke baare mein pooch sakte ho."
                };
        }
    }


    /* =====================================================
       MARKDOWN-LIKE TEXT FORMATTER
    ===================================================== */

    function formatText(text) {

        const escaped = String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return escaped
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>");
    }


    /* =====================================================
       SCROLL TO BOTTOM
    ===================================================== */

    function scrollMessages() {

        aiMessages.scrollTop = aiMessages.scrollHeight;

    }


    /* =====================================================
       ADD MESSAGE
    ===================================================== */

    function addMessage(text, type, speechText) {

        const message = document.createElement("div");

        message.className = "ai-message " + type;

        if (type === "bot") {

            const smallAvatar = document.createElement("div");

            smallAvatar.className = "ai-avatar-small";
            smallAvatar.textContent = "AI";


            const bubble = document.createElement("div");

            bubble.className = "ai-bubble";


            const name = document.createElement("div");

            name.className = "ai-message-name";
            name.textContent = "Aditya AI";


            const messageText = document.createElement("div");

            messageText.className = "ai-message-text";
            messageText.innerHTML = formatText(text);


            const actions = document.createElement("div");

            actions.className = "ai-message-actions";


            const copyButton = document.createElement("button");

            copyButton.type = "button";
            copyButton.className = "ai-action-btn";
            copyButton.textContent = "Copy";

            copyButton.addEventListener("click", function () {

                copyText(text, copyButton);

            });


            const speakButton = document.createElement("button");

            speakButton.type = "button";
            speakButton.className = "ai-action-btn";
            speakButton.textContent = "🔊 Speak";

            speakButton.addEventListener("click", function () {

                speakText(speechText || text);

            });


            actions.appendChild(copyButton);
            actions.appendChild(speakButton);

            bubble.appendChild(name);
            bubble.appendChild(messageText);
            bubble.appendChild(actions);

            message.appendChild(smallAvatar);
            message.appendChild(bubble);

        } else {

            const bubble = document.createElement("div");

            bubble.className = "ai-bubble";
            bubble.innerHTML = formatText(text);

            message.appendChild(bubble);

        }

        aiMessages.appendChild(message);

        scrollMessages();

        return message;
    }


    /* =====================================================
       TYPING MESSAGE
    ===================================================== */

    function showTyping() {

        const message = document.createElement("div");

        message.className = "ai-message bot ai-typing-message";

        message.innerHTML =
            '<div class="ai-avatar-small">AI</div>' +
            '<div class="ai-bubble">' +
            '<div class="ai-message-name">Aditya AI</div>' +
            '<div class="ai-typing-dots">' +
            '<span></span><span></span><span></span>' +
            '</div>' +
            '</div>';

        aiMessages.appendChild(message);

        scrollMessages();

        return message;
    }


    /* =====================================================
       SEND QUESTION
    ===================================================== */

    function askAI(shouldSpeak) {

        if (isTyping) {
            return;
        }

        const question = aiInput.value.trim();

        if (!question) {
            return;
        }

        addMessage(question, "user");

        aiInput.value = "";

        resizeInput();

        isTyping = true;

        const typingMessage = showTyping();

        setTimeout(function () {

            if (typingMessage) {
                typingMessage.remove();
            }

            const answer = getAdityaAnswer(question);

            addMessage(
                answer.text,
                "bot",
                answer.speech
            );

            isTyping = false;

            if (shouldSpeak) {
                speakText(answer.speech);
            }

        }, 650);
    }


    /* =====================================================
       SEND BUTTON
    ===================================================== */

    sendAiBtn.addEventListener("click", function () {

        askAI(false);

    });


    /* =====================================================
       ENTER KEY
    ===================================================== */

    aiInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            askAI(false);

        }

    });


    /* =====================================================
       AUTO RESIZE TEXTAREA
    ===================================================== */

    function resizeInput() {

        aiInput.style.height = "auto";

        aiInput.style.height =
            Math.min(aiInput.scrollHeight, 110) + "px";

    }


    aiInput.addEventListener("input", resizeInput);


    /* =====================================================
       OPEN AI
    ===================================================== */

    aiToggle.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen =
            aiBox.classList.toggle("active");

        aiToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        aiBox.setAttribute(
            "aria-hidden",
            isOpen ? "false" : "true"
        );

        if (isOpen) {

            setTimeout(function () {

                aiInput.focus();

                scrollMessages();

            }, 200);

        }

    });


    /* =====================================================
       CLOSE AI
    ===================================================== */

    aiClose.addEventListener("click", function () {

        closeAI();

    });


    function closeAI() {

        aiBox.classList.remove("active");

        aiToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        aiBox.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeAI();

        }

    });


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    document.addEventListener("click", function (event) {

        if (!aiBox.contains(event.target) &&
            !aiToggle.contains(event.target)) {

            closeAI();

        }

    });


    /* =====================================================
       CLEAR CHAT
    ===================================================== */

    if (aiClear) {

        aiClear.addEventListener("click", function () {

            aiMessages.innerHTML = "";

            addMessage(
                "👋 Hey! I'm Aditya AI.\n\n" +
                "Mujhse Aditya ke baare mein kuch bhi pooch sakte ho — skills, projects, education, contact ya Nexora AI.",

                "bot",

                "Hey! I'm Aditya AI. Mujhse Aditya ke baare mein kuch bhi pooch sakte ho."
            );

            aiInput.value = "";

            resizeInput();

            aiInput.focus();

        });

    }


    /* =====================================================
       QUICK SUGGESTIONS
    ===================================================== */

    if (aiSuggestions) {

        aiSuggestions
            .querySelectorAll("button[data-question]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const question =
                        button.getAttribute("data-question");

                    aiInput.value = question;

                    resizeInput();

                    askAI(false);

                });

            });

    }


    /* =====================================================
       COPY TEXT
    ===================================================== */

    async function copyText(text, button) {

        try {

            await navigator.clipboard.writeText(text);

            const oldText = button.textContent;

            button.textContent = "✓ Copied";

            setTimeout(function () {

                button.textContent = oldText;

            }, 1200);

        } catch (error) {

            const temp =
                document.createElement("textarea");

            temp.value = text;

            document.body.appendChild(temp);

            temp.select();

            document.execCommand("copy");

            temp.remove();

            button.textContent = "✓ Copied";

            setTimeout(function () {

                button.textContent = "Copy";

            }, 1200);

        }

    }


    /* =====================================================
       TEXT TO SPEECH
    ===================================================== */

    function speakText(text) {

        if (!("speechSynthesis" in window)) {

            return;

        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = "en-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1;

        const voices =
            window.speechSynthesis.getVoices();

        const preferredVoice =
            voices.find(function (voice) {

                return (
                    voice.lang === "en-IN" ||
                    voice.lang === "hi-IN"
                );

            });

        if (preferredVoice) {

            utterance.voice = preferredVoice;

        }

        window.speechSynthesis.speak(utterance);

    }


    /* =====================================================
       VOICE INPUT
    ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        micBtn.title =
            "Voice input is not supported in this browser";

        micBtn.style.opacity = "0.6";

    } else {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        recognition.onstart = function () {

            isListening = true;

            micBtn.classList.add("listening");

            micBtn.textContent = "⏹";

        };


        recognition.onresult = function (event) {

            const transcript =
                event.results[0][0].transcript;

            aiInput.value = transcript;

            resizeInput();

            askAI(true);

        };


        recognition.onerror = function () {

            isListening = false;

            micBtn.classList.remove("listening");

            micBtn.textContent = "🎙";

        };


        recognition.onend = function () {

            isListening = false;

            micBtn.classList.remove("listening");

            micBtn.textContent = "🎙";

        };


        micBtn.addEventListener("click", function () {

            if (isListening) {

                recognition.stop();

                return;

            }

            try {

                recognition.start();

            } catch (error) {

                console.warn(
                    "Aditya AI voice input:",
                    error
                );

            }

        });

    }


    /* =====================================================
       AI BUTTON RIPPLE
    ===================================================== */

    aiToggle.addEventListener("mousedown", function () {

        aiToggle.classList.add("pressed");

    });

    aiToggle.addEventListener("mouseup", function () {

        aiToggle.classList.remove("pressed");

    });


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    aiBox.classList.remove("active");

    aiBox.setAttribute(
        "aria-hidden",
        "true"
    );

    aiToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    console.log(
        "Aditya AI loaded successfully."
    );

});