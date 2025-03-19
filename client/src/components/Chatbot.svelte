<script>
    import { onMount, afterUpdate } from "svelte";
    import bot from "$lib/images/bot.gif";
    import Icon from "@iconify/svelte";
    import { toast } from "svelte-sonner"; // For toast notifications

    /**
	 * @type {any[]}
	 */
    let messages = [];
    let userInput = "";
    let isChatOpen = false;
    let isTyping = false;
    /**
	 * @type {HTMLDivElement}
	 */
    let chatBody;

    // Define the sequence of questions
    const questions = [
        { id: "name", text: "What is your name or company name?", validation: (/** @type {{ trim: () => { (): any; new (): any; length: number; }; }} */ value) => value.trim().length > 0 },
        { id: "mobile", text: "What is your mobile number?", validation: (/** @type {string} */ value) => /^\d{10}$/.test(value) },
        { id: "email", text: "What is your email address?", validation: (/** @type {string} */ value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
        {
            id: "service",
            text: "Which service are you interested in? (Select multiple)",
            type: "checkbox",
            options: ["STEM Lab", "ATL Tinkering Lab", "PM SHRI Lab", "Workshops", "Electronics Lab", "Robotics Lab"],
            validation: (/** @type {string | any[]} */ value) => value.length > 0 // At least one option must be selected
        },
        { id: "requirements", text: "Do you have any specific requirements?", validation: () => true } // Optional field
    ];

    let currentQuestionIndex = 0;
    let responses = {};
    /**
	 * @type {any[]}
	 */
    let selectedServices = []; // Store selected services for the checkbox question

    // Reset chatbot state when closed
    function resetChat() {
        messages = [];
        userInput = "";
        currentQuestionIndex = 0;
        responses = {};
        selectedServices = [];
    }

    function handleUserInput() {
        const currentQuestion = questions[currentQuestionIndex];
        const isValid = currentQuestion.validation(userInput);

        if (isValid) {
            responses[currentQuestion.id] = userInput;
            messages = [...messages, { text: userInput, sender: "user" }];
            userInput = "";

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                askNextQuestion();
            } else {
                showFinalMessage();
                sendEmail(); // Send email after final response
            }
        } else {
            messages = [...messages, { text: "Invalid input. Please try again.", sender: "bot" }];
        }
    }

    /**
	 * @param {string} value
	 */
    function handleCheckboxInput(value) {
        if (selectedServices.includes(value)) {
            selectedServices = selectedServices.filter((item) => item !== value); // Deselect
        } else {
            selectedServices = [...selectedServices, value]; // Select
        }
        userInput = selectedServices.join(", "); // Update input box with selected options
    }

    function submitCheckboxInput() {
        if (selectedServices.length > 0) {
            responses[questions[currentQuestionIndex].id] = selectedServices.join(", ");
            messages = [...messages, { text: selectedServices.join(", "), sender: "user" }];
            selectedServices = []; // Clear selected services
            userInput = ""; // Clear input box

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                askNextQuestion();
            } else {
                showFinalMessage();
                sendEmail(); // Send email after final response
            }
        } else {
            messages = [...messages, { text: "Please select at least one option.", sender: "bot" }];
        }
    }

    function askNextQuestion() {
        const nextQuestion = questions[currentQuestionIndex];
        simulateTyping(() => {
            messages = [...messages, { text: nextQuestion.text, sender: "bot" }];
        });
    }

    function showFinalMessage() {
        simulateTyping(() => {
            messages = [
                ...messages,
                { text: "Thanks for your response! Our team will contact you shortly.", sender: "bot" }
            ];
            // Auto-close the chatbox after 3 seconds
            setTimeout(() => {
                closeChat();
            }, 3000);
        });
    }

    /**
	 * @param {{ (): void; (): void; (): void; }} callback
	 */
    function simulateTyping(callback) {
        isTyping = true;
        setTimeout(() => {
            isTyping = false;
            callback();
        }, 1000);
    }

    async function sendEmail() {
        const payload = {
            service_id: 'service_d1pb0w7', // Replace with your EmailJS service ID
            template_id: 'template_5eda1rn', // Replace with your EmailJS template ID
            user_id: 'CdswteZ6BTKu2ZOE3', // Replace with your EmailJS user ID
            template_params: {
                name: responses.name,
                email: responses.email,
                mobile: responses.mobile,
                interestedServices: responses.service,
                message: responses.requirements || 'N/A',
            },
        };

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();

            if (response.ok) {
                toast.success('Your message has been sent successfully!');
                // Auto-close the chatbox after 3 seconds
                setTimeout(() => {
                    closeChat();
                }, 3000);
            } else {
                console.error('Server response:', responseText);
                toast.error(`Failed to send email. Status: ${response.status}. Please check console for details.`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('An error occurred while sending the email.');
        }
    }

    function toggleChat() {
        if (!isChatOpen) {
            resetChat(); // Reset chat state when opening
            askNextQuestion(); // Start the conversation
        }
        isChatOpen = !isChatOpen;
    }

    function closeChat() {
        isChatOpen = false;
    }

    function scrollToBottom() {
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    afterUpdate(() => {
        scrollToBottom();
    });

    onMount(() => {
        scrollToBottom();
        document.addEventListener("click", (e) => {
            if (isChatOpen && !e.target.closest(".chatbot-container")) {
                closeChat();
            }
        });
    });
</script>

<style>
    .chatbot-container {
        position: fixed;
        bottom: 40px;
        right: 40px;
        z-index: 1000;
    }

    .chatbot-icon {
        width: 110px;
        height: 70px;
        cursor: pointer;
    }

    .chatbot {
        width: 300px;
        background: rgba(32, 0, 108, 0.847);
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        display: none;
    }

    .chatbot.open {
        display: block;
    }

    .close-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        z-index: 10;
    }

    .chat-header {
        background: linear-gradient(to right, #6504b0, #c961de);
        color: #fff;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: center;
        font-weight: bold;
    }

    .chat-body {
        padding: 10px;
        height: 200px;
        overflow-y: auto;
        border-bottom: 1px solid #ccc;
    }

    .message {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        max-width: 80%;
    }

    .message.user {
        background: #6504b0;
        color: #fff;
        margin-left: auto;
    }

    .message.bot {
        background: #f0f0f0;
        color: #000;
        margin-right: auto;
    }

    .chat-footer {
        padding: 10px;
    }

    input {
        width: 100%;
        padding: 5px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }

    .checkbox-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
    }

    .checkbox-option {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .checkbox-option input {
        width: auto;
    }

    .checkbox-option label {
        color: #fff;
    }

    .typing-animation {
        display: inline-block;
        font-size: 24px;
        color: #888;
    }

    .typing-animation span {
        display: inline-block;
        animation: wave 1.5s infinite;
        opacity: 0;
    }

    .typing-animation span:nth-child(1) {
        animation-delay: 0s;
    }

    .typing-animation span:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-animation span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes wave {
        0% {
            opacity: 0;
            transform: translateY(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-5px);
        }
        100% {
            opacity: 0;
            transform: translateY(0);
        }
    }
</style>

<div class="chatbot-container">
    <!-- Bot Icon -->
    <img src={bot} alt="Chatbot" class="chatbot-icon" on:click={toggleChat} />

    <!-- Chat UI -->
    <div class="chatbot relative {isChatOpen ? 'open' : ''}">
        <!-- Close Icon -->
        {#if isChatOpen}
            <div class="close-icon" on:click={toggleChat}>
                <Icon icon="material-symbols:close-small-outline-rounded" class="text-white" width="24" height="24" />
            </div>
        {/if}

        <!-- Chat Header -->
        <div class="chat-header">Chatbot</div>

        <!-- Chat Body -->
        <div class="chat-body" bind:this={chatBody}>
            {#each messages as message}
                <div class="message {message.sender}">{message.text}</div>
            {/each}
            {#if isTyping}
                <div class="message bot">
                    <div class="typing-animation font-extrabold">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            {/if}
            {#if questions[currentQuestionIndex]?.type === "checkbox"}
                <div class="checkbox-options">
                    {#each questions[currentQuestionIndex].options as option}
                        <div class="checkbox-option">
                            <input
                                type="checkbox"
                                id={option}
                                name="service"
                                value={option}
                                on:change={() => handleCheckboxInput(option)}
                            />
                            <label for={option}>{option}</label>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Chat Footer -->
        <div class="chat-footer">
            {#if questions[currentQuestionIndex]?.type === "checkbox"}
                <input
                    bind:value={userInput}
                    placeholder="Selected options will appear here"
                    on:keydown={(e) => e.key === "Enter" && submitCheckboxInput()}
                    readonly
                />
            {:else}
                <input
                    bind:value={userInput}
                    placeholder="Type your answer..."
                    on:keydown={(e) => e.key === "Enter" && handleUserInput()}
                />
            {/if}
        </div>
    </div>
</div>