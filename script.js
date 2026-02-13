document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const trollScreen = document.getElementById('troll-screen');
    const giftsScreen = document.getElementById('gifts-screen');
    
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const btnRetry = document.getElementById('btn-retry');
    
    const giftBoxes = document.querySelectorAll('.gift-box');

    // Photo carousel functionality
    const couplePhotos = document.querySelectorAll('.couple-photo');
    const indicators = document.querySelectorAll('.indicator');
    let currentPhotoIndex = 0;
    let carouselInterval;

    // Check if any photos are actually loaded
    function hasLoadedPhotos() {
        return Array.from(couplePhotos).some(photo => {
            return photo.complete && photo.naturalHeight !== 0 && 
                   photo.src.includes('photo-couple-');
        });
    }

    function showPhoto(index) {
        couplePhotos.forEach((photo, i) => {
            if (i === index) {
                photo.classList.add('active');
            } else {
                photo.classList.remove('active');
            }
        });

        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        currentPhotoIndex = index;
    }

    function nextPhoto() {
        let nextIndex = (currentPhotoIndex + 1) % couplePhotos.length;
        showPhoto(nextIndex);
    }

    function startCarousel() {
        // Only start carousel if we have loaded photos
        if (hasLoadedPhotos()) {
            carouselInterval = setInterval(nextPhoto, 3000); // Change photo every 3 seconds
        }
    }

    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }

    // Manual control via indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopCarousel();
            showPhoto(index);
            startCarousel(); // Restart auto-rotation after manual selection
        });
    });

    // Pause on hover, resume on mouse leave
    const photoFrame = document.querySelector('.photo-frame');
    if (photoFrame) {
        photoFrame.addEventListener('mouseenter', stopCarousel);
        photoFrame.addEventListener('mouseleave', startCarousel);
    }

    // Check photos after they load
    couplePhotos.forEach(photo => {
        photo.addEventListener('load', function() {
            if (this.complete && this.naturalHeight !== 0) {
                // At least one photo loaded, start carousel
                if (!carouselInterval) {
                    startCarousel();
                }
            }
        });
    });

    // Start carousel on page load if photos are already cached
    if (hasLoadedPhotos()) {
        startCarousel();
    }

    function switchScreen(fromScreen, toScreen) {
        fromScreen.style.opacity = '0';
        
        setTimeout(() => {
            fromScreen.classList.remove('active');
            toScreen.classList.add('active');
            
            // Stop carousel when leaving welcome screen
            if (fromScreen === welcomeScreen) {
                stopCarousel();
            }
            // Restart carousel when returning to welcome screen
            if (toScreen === welcomeScreen) {
                startCarousel();
            }
        }, 600);
    }

    btnYes.addEventListener('click', function() {
        switchScreen(welcomeScreen, giftsScreen);
    });

    btnNo.addEventListener('click', function() {
        switchScreen(welcomeScreen, trollScreen);
    });

    btnRetry.addEventListener('click', function() {
        switchScreen(trollScreen, giftsScreen);
    });

    giftBoxes.forEach((box, index) => {
        box.addEventListener('click', function() {
            if (!this.classList.contains('opened')) {
                this.classList.add('opened');
                
                setTimeout(() => {
                    const content = this.querySelector('.gift-content');
                    content.style.animation = 'fadeIn 0.5s ease';
                }, 400);
            }
        });
        
        box.style.animationDelay = `${index * 0.15}s`;
        box.style.animation = 'fadeInUp 0.8s ease backwards';
    });

    const finalMessage = document.querySelector('.final-message');
    if (finalMessage) {
        finalMessage.style.animation = 'fadeInUp 1s ease 1.5s backwards';
    }

    document.querySelectorAll('img[src]').forEach(img => {
        const placeholder = img.nextElementSibling;
        
        img.addEventListener('load', function() {
            if (this.complete && this.naturalHeight !== 0) {
                if (placeholder && placeholder.classList.contains('photo-placeholder') || 
                    placeholder && placeholder.classList.contains('gift-photo-placeholder')) {
                    placeholder.style.display = 'none';
                }
                this.style.display = 'block';
            }
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        });
        
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });

    const couponItems = document.querySelectorAll('.coupon-item');
    couponItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.4s ease ${0.2 + (index * 0.1)}s backwards`;
    });
});
