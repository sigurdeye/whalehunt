class DatingApp {
    constructor() {
        this.landingPage = document.getElementById('landingPage');
        this.datingInterface = document.getElementById('datingInterface');
        this.cardStack = document.getElementById('cardStack');
        this.matchOverlay = document.getElementById('matchOverlay');
        this.startButton = document.getElementById('startButton');
        
        this.currentCard = null;
        this.initialX = 0;
        this.isDragging = false;

        this.girlImages = [
            'images/fat1.jpg',
            'images/fat2.jpg',
            'images/fat3.jpg',
            'images/fat4.jpg',
            'images/fat5.jpg',
            'images/fat6.jpg',
            'images/fat7.jpg',
            'images/fat8.jpg',
            'images/fat9.jpg'
        ];

        this.girlNames = [
            'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 
            'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 
            'Sofia', 'Madison', 'Avery', 'Ella', 'Scarlett', 'Victoria', 
            'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey',
            'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey',
            'Ellie', 'Stella', 'Natalie', 'Zoe', 'Leah', 'Hazel', 'Violet',
            'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire'
        ];

        this.matches = [];
        this.rejectionMessages = [
            "You seem sweet, but I can't date someone who'd ruin my Instagram aesthetic.",
            "You're cute, but I'm more of a front-row-at-Paris-Fashion-Week kind of girl, you know?",
            "I just feel like when we'd take selfies, people would wonder if it's a 'Make-A-Wish' situation.",
            "Sorry, I just can't risk a guy whose reflection might crack my luxury compact mirror.",
            "You're nice, but I need a man who looks good crying in the rain for me.",
            "If I dated you, people might think I'm trying out charity work for my résumé.",
            "It's not you, it's me. Actually, it's mostly my cheekbones and how much better they deserve.",
            "I'm just so used to people staring at me, I don't think I could handle being the only one.",
            "I'm flattered, but I just feel like your level of pretty would cancel out mine in group photos."
        ];

        this.activeNotifications = [];
        this.notificationOffset = 20; // Base bottom offset in pixels

        this.foodInterests = [
            "Competitive eating 🏆",
            "Buffet exploring 🍽️",
            "Pizza taste-testing 🍕",
            "Ice cream sampling 🍦",
            "Fast food collecting 🍔",
            "Professional snacking 🍿",
            "Cake quality control 🎂",
            "Donut evaluation 🍩",
            "Burger rating 🍔",
            "Fries appreciation 🍟",
            "Milkshake research 🥤",
            "Cookie inspection 🍪",
            "Pasta expertise 🍝",
            "Taco analysis 🌮",
            "Chocolate studies 🍫"
        ];

        this.matchCount = 0;

        this.girlBios = [
            "Curvy queen with a taste for luxury 💅🏼 Will match your vibe if your wallet matches my appetite.",
            "Looking for a man who will treat me like the goddess I am… and maybe buy me mozzarella sticks at 2 AM.",
            "I'm 5'4 but my standards are 6'5. If you don't bring me snacks, we're done.",
            "BBW = Big Beautiful Winner. Now, where's my crown and my $400 dinner date?",
            "I'm the main character, and you're the side quest who brings me donuts.",
            "Must be over 6 feet tall and under 2 hours away from a Taco Bell. That's the bare minimum.",
            "If you can't worship my curves, swipe left, peasant.",
            "I don't chase, I replace. Unless it's for cheesecake, then I might run.",
            "Princess? Try Empress. Now go fetch me my iced caramel macchiato with extra whipped cream.",
            "Binge-watching Netflix while you feed me nuggets is my love language. Don't disappoint me.",
            "Plus-size, but so is my personality. Prepare to adore me or get out of my way.",
            "Looking for someone who can match my energy and my Uber Eats bill.",
            "You better like girls who are soft, loud, and extremely high-maintenance. It's non-negotiable.",
            "No, I'm not high-maintenance. I just know my worth, and it's at least three vacations a year and weekly date nights at fancy steakhouses.",
            "Swipe right if you're ready to become my personal hype man and human footrest. Applications close tomorrow."
        ];

        this.init();
    }

    init() {
        this.startButton.addEventListener('click', () => this.startApp());
        this.setupCards();
        this.setupSwipeListeners();
        this.startMessageInterval();
    }

    startApp() {
        this.landingPage.classList.add('hidden');
        this.datingInterface.classList.remove('hidden');
    }

    setupCards() {
        const profiles = this.generateRandomProfiles(100);
        profiles.forEach(profile => {
            const card = this.createCard(profile);
            this.cardStack.appendChild(card);
        });
    }

    generateRandomProfiles(count) {
        const profiles = [];
        for (let i = 0; i < count; i++) {
            profiles.push({
                id: i + 1,
                name: this.getRandomElement(this.girlNames),
                age: this.getRandomNumber(18, 35),
                weight: this.getRandomNumber(170, 400),
                image: this.getRandomElement(this.girlImages),
                interest: this.getRandomElement(this.foodInterests),
                bio: this.getRandomElement(this.girlBios)
            });
        }
        return profiles;
    }

    getRandomUniqueElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    createCard(profile) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}">
            <div class="card-info">
                <h3>${profile.name}, ${profile.age}</h3>
                <p class="weight">${profile.weight} lbs</p>
                <p class="bio">${profile.bio}</p>
                <div class="interests">
                    <span class="interest">${profile.interest}</span>
                </div>
            </div>
        `;
        return card;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setupSwipeListeners() {
        this.cardStack.addEventListener('mousedown', e => this.startDrag(e));
        document.addEventListener('mousemove', e => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
    }

    startDrag(e) {
        if (!e.target.closest('.card')) return;
        this.isDragging = true;
        this.currentCard = e.target.closest('.card');
        this.initialX = e.clientX;
    }

    drag(e) {
        if (!this.isDragging || !this.currentCard) return;
        
        const currentX = e.clientX;
        const diff = currentX - this.initialX;
        this.currentCard.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;
    }

    endDrag() {
        if (!this.isDragging || !this.currentCard) return;
        
        const diff = parseInt(this.currentCard.style.transform.match(/-?\d+/)[0]);
        
        if (Math.abs(diff) > 100) {
            // Swipe threshold reached
            const direction = diff > 0 ? 'right' : 'left';
            this.handleSwipe(direction);
        } else {
            // Reset card position
            this.currentCard.style.transform = '';
        }

        this.isDragging = false;
        this.currentCard = null;
    }

    handleSwipe(direction) {
        const card = this.currentCard;
        const cardImage = card.querySelector('img').src;
        const cardWeight = card.querySelector('.card-info p').textContent;
        const cardName = card.querySelector('.card-info h3').textContent.split(',')[0];
        
        // Add the appropriate animation class
        card.classList.add(direction === 'right' ? 'fade-out-right' : 'fade-out-left');
        
        // Remove the card after animation completes
        setTimeout(() => {
            card.remove();
        }, 500);
        
        // Show match overlay if swiped right and store match
        if (direction === 'right') {
            this.matches.push({ name: cardName, image: cardImage });
            this.showMatch(cardImage, cardWeight, cardName);
            this.incrementMatchCount();
        }
    }

    incrementMatchCount() {
        this.matchCount++;
        document.getElementById('matchCount').textContent = this.matchCount;
    }

    showMatch(image, weight, name) {
        const matchImage = document.getElementById('matchImage');
        const matchDetails = document.getElementById('matchDetails');
        const matchProfile = document.querySelector('.match-profile');
        const matchName = document.getElementById('matchName');
        
        // Hide profile initially
        matchProfile.style.display = 'none';
        
        // Show match overlay with just the text
        this.matchOverlay.classList.remove('hidden');
        
        // After 1.5s, show the profile
        setTimeout(() => {
            matchImage.src = image;
            matchDetails.textContent = weight;
            matchName.textContent = name;
            matchProfile.style.display = 'block';
            
            // Hide everything after another 2s
            setTimeout(() => {
                this.matchOverlay.classList.add('hidden');
                matchProfile.style.display = 'none';
            }, 2000);
        }, 1500);
    }

    startMessageInterval() {
        setInterval(() => {
            if (this.matches.length > 0) {
                const randomMatch = this.getRandomElement(this.matches);
                this.showMessageNotification(randomMatch);
            }
        }, this.getRandomNumber(10000, 20000)); // Random interval between 10-20 seconds
    }

    showMessageNotification(match) {
        // Create notification bubble
        const notification = document.createElement('div');
        notification.className = 'message-notification';
        notification.innerHTML = `${match.name} sent you a message!`;
        
        // Calculate position based on existing notifications
        const offset = this.notificationOffset * (this.activeNotifications.length);
        notification.style.bottom = `${this.notificationOffset + offset}px`;
        
        // Add click handler to open chat
        notification.addEventListener('click', () => {
            this.openChat(match);
            // Remove this notification from the stack
            this.removeNotification(notification);
        });
        
        document.body.appendChild(notification);
        this.activeNotifications.push(notification);
        this.repositionNotifications();
    }

    removeNotification(notification) {
        const index = this.activeNotifications.indexOf(notification);
        if (index > -1) {
            this.activeNotifications.splice(index, 1);
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
                this.repositionNotifications();
            }, 500);
        }
    }

    repositionNotifications() {
        this.activeNotifications.forEach((notification, index) => {
            notification.style.bottom = `${this.notificationOffset + (index * this.notificationOffset)}px`;
        });
    }

    openChat(match) {
        // Create a new chat overlay
        const chatOverlay = document.createElement('div');
        chatOverlay.className = 'chat-overlay';
        
        // Calculate position based on existing chats
        const existingChats = document.querySelectorAll('.chat-overlay:not(.hidden)');
        const offset = existingChats.length * 30; // Offset each chat by 30px
        
        chatOverlay.style.transform = `translate(-${offset}px, -${offset}px)`;
        
        chatOverlay.innerHTML = `
            <div class="chat-content">
                <div class="chat-header">
                    <h3>${match.name}</h3>
                    <button class="close-chat">×</button>
                </div>
                <div class="chat-body">
                    <div class="message-bubble">
                        <p>${this.getRandomElement(this.rejectionMessages)}</p>
                    </div>
                    <div class="unmatch-message">
                        ${match.name} has unmatched you
                    </div>
                </div>
            </div>
        `;
        
        // Add close button functionality
        chatOverlay.querySelector('.close-chat').addEventListener('click', () => {
            chatOverlay.remove();
        });
        
        // Add to document
        document.body.appendChild(chatOverlay);
        
        // Make chat draggable
        this.makeChatDraggable(chatOverlay);
    }

    makeChatDraggable(chatOverlay) {
        const header = chatOverlay.querySelector('.chat-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header) {
                isDragging = true;
                chatOverlay.style.zIndex = this.getHighestZIndex() + 1;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                
                chatOverlay.style.transform = 
                    `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Bring chat to front when clicked
        chatOverlay.addEventListener('mousedown', () => {
            chatOverlay.style.zIndex = this.getHighestZIndex() + 1;
        });
    }

    getHighestZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('.chat-overlay'))
                .map(el => parseInt(getComputedStyle(el).zIndex) || 0)
        );
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new DatingApp();
}); 