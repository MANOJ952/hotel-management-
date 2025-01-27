const bookNowButton = document.querySelector('.book-now-btn');
const modal = document.getElementById('bookingModal');

document.addEventListener('DOMContentLoaded', () => {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true
        });
    
        const bookNowButton = document.querySelector('.book-now-btn');
        const modal = document.getElementById('bookingModal');
    
        // Event listener for the 'Book Now' button
        bookNowButton.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    
        // The rest of your existing code...
        const hostelLocation = { lat: 17.385044, lng: 78.486671 };
    
        // Other existing code...
    });

    // Event listener for the 'Book Now' button
    bookNowButton.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Booking Modal
    const bookBtns = document.querySelectorAll('.book-btn, .book-now-btn');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('bookingForm');

    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Function to handle booking form submission
    async function handleBookingSubmit(event) {
        event.preventDefault();
        console.log('Form submission started');

        // Clear previous error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        try {
            // Get form values
            const name = document.getElementById('bookingName').value.trim();
            const email = document.getElementById('bookingEmail').value.trim();
            const phone = document.getElementById('bookingPhone').value.trim();
            const roomType = document.getElementById('bookingRoomType');
            const checkIn = document.getElementById('bookingCheckIn').value;
            const checkOut = document.getElementById('bookingCheckOut').value;
            const guests = document.getElementById('bookingGuests').value;
            const specialRequests = document.getElementById('bookingRequests').value.trim();
            const terms = document.getElementById('bookingTerms').checked;

            // Validate form
            if (!name) {
                throw new Error('Name is required.');
            }
            if (!email) {
                throw new Error('Email is required.');
            }
            if (!phone) {
                throw new Error('Phone number is required.');
            }
            if (!roomType.value) {
                throw new Error('Room type must be selected.');
            }
            if (!checkIn) {
                throw new Error('Check-in date is required.');
            }
            if (!checkOut) {
                throw new Error('Check-out date is required.');
            }
            if (!guests) {
                throw new Error('Number of guests is required.');
            }
            if (!terms) {
                throw new Error('You must accept the terms and conditions.');
            }

            // Get room type display name and calculate total price
            const roomTypeText = roomType.options[roomType.selectedIndex].text;
            const totalPrice = calculateTotalPrice();

            // Prepare email template parameters
            const templateParams = {
                to_name: 'Gandiv Hostel',
                from_name: name,
                from_email: email,
                phone_number: phone,
                room_type: roomTypeText,
                check_in_date: checkIn,
                check_out_date: checkOut,
                number_of_guests: guests,
                special_requests: specialRequests || 'None',
                total_price: totalPrice,
                message: `
                    Booking Details:
                    ------------------------------
                    Name: ${name}
                    Email: ${email}
                    Phone: ${phone}
                    Room: ${roomTypeText}
                    Check-in: ${checkIn}
                    Check-out: ${checkOut}
                    Guests: ${guests}
                    Special Requests: ${specialRequests || 'None'}
                    Total: ${totalPrice}
                `
            };

            console.log('Sending email with template params:', templateParams);

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_9rh0iqc',
                'template_x4ufnzm',
                templateParams
            );

            console.log('Email sent successfully:', response);

            if (response.status === 200) {
                showSuccessMessage('Booking request sent successfully! We will contact you shortly.');
                resetBookingForm();
                closeBookingModal();
            } else {
                throw new Error('Failed to send booking request. Status: ' + response.status);
            }
        } catch (error) {
            console.error('Booking submission error:', error);
            showErrorMessage(error.message || 'Failed to send booking request. Please try again.');

            // Display error message next to the relevant field
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.textContent = error.message;
            const formField = document.getElementById('bookingForm');
            formField.appendChild(errorDiv);
        }
    }

    // Function to calculate total price
    function calculateTotalPrice() {
        const roomType = document.getElementById('bookingRoomType').value;
        const checkIn = new Date(document.getElementById('bookingCheckIn').value);
        const checkOut = new Date(document.getElementById('bookingCheckOut').value);
        
        // Calculate number of nights
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Room prices
        const prices = {
            'single': 599,
            'double': 999,
            'dormitory': 399
        };
        
        const totalPrice = prices[roomType] * nights;
        return `₹${totalPrice}`;
    }

    // Function to show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            text-align: center;
            min-width: 300px;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Function to show error message
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: #f44336;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            text-align: center;
            min-width: 300px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Add event listener to booking form
    bookingForm.addEventListener('submit', handleBookingSubmit);

    // Room Search Functionality
    const searchRoomsBtn = document.querySelector('.search-rooms-btn');
    const roomsGrid = document.querySelector('.rooms-grid');

    searchRoomsBtn.addEventListener('click', () => {
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const roomType = document.getElementById('room-type').value;

        // Here you would typically fetch available rooms from your server
        // For now, we'll just show some example rooms
        const rooms = [
            {
                type: 'single',
                name: 'Cozy Single Room',
                price: '₹599',
                image: 'images/single-room.jpg',
                amenities: ['Single Bed', 'Shared Bathroom', 'Free WiFi']
            },
            {
                type: 'double',
                name: 'Deluxe Double Room',
                price: '₹999',
                image: 'images/double-room.jpg',
                amenities: ['Double Bed', 'Private Bathroom', 'Free WiFi', 'TV']
            },
            {
                type: 'dormitory',
                name: '6-Bed Dormitory',
                price: '₹399',
                image: 'images/dorm-room.jpg',
                amenities: ['Bunk Bed', 'Shared Bathroom', 'Locker']
            }
        ];

        // Filter rooms based on selection
        const filteredRooms = roomType ? rooms.filter(room => room.type === roomType) : rooms;

        // Display rooms
        roomsGrid.innerHTML = filteredRooms.map(room => `
            <div class="room-card" data-aos="fade-up">
                <img src="${room.image}" alt="${room.name}" class="room-image">
                <div class="room-info">
                    <h3>${room.name}</h3>
                    <p class="room-price">${room.price}<span>/night</span></p>
                    <ul class="room-amenities">
                        ${room.amenities.map(amenity => `<li><i class="fas fa-check"></i>${amenity}</li>`).join('')}
                    </ul>
                    <button class="book-now-btn">Book Now</button>
                </div>
            </div>
        `).join('');

        // Reinitialize AOS for new elements
        AOS.refresh();

        // Add event listeners to new book buttons
        document.querySelectorAll('.room-card .book-now-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send this data to your server
        console.log('Contact form data:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Initialize Google Maps
    window.initMap = function() {
        // Replace with your hostel's coordinates
        const hostelLocation = { lat: 17.385044, lng: 78.486671 }; // Example: Hyderabad coordinates
        
        const map = new google.maps.Map(document.getElementById('hostel-map'), {
            zoom: 15,
            center: hostelLocation,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{"weight": "2.00"}]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#9c9c9c"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                }
            ]
        });

        const marker = new google.maps.Marker({
            position: hostelLocation,
            map: map,
            title: 'Gandiv Luxury Hostels'
        });

        const infoWindow = new google.maps.InfoWindow({
            content: '<div style="padding: 10px;"><h3>Gandiv Luxury Hostels</h3><p>Your perfect stay awaits!</p></div>'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    };

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        }
    });// Inside the event listener for the searchRoomsBtn
    roomsGrid.innerHTML = filteredRooms.map(room => `
        <div class="room-card" data-aos="fade-up">
            <img src="${room.image}" alt="${room.name}" class="room-image">
            <div class="room-info">
                <h3>${room.name}</h3>
                <p class="room-price">${room.price}<span>/night</span></p>
                <ul class="room-amenities">
                    ${room.amenities.map(amenity => `<li><i class="fas fa-check"></i>${amenity}</li>`).join('')}
                </ul>
                <button class="book-now-btn">Book Now</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new book buttons
    document.querySelectorAll('.room-card .book-now-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';document.addEventListener('DOMContentLoaded', () => {
                // Initialize AOS
                AOS.init({
                    duration: 800,
                    easing: 'ease-out',
                    once: true
                });
            
                const bookNowButtons = document.querySelectorAll('.book-now-btn');
                const modal = document.getElementById('bookingModal');
                const closeModalButton = document.querySelector('.close-modal');
            
                // Event listener for the 'Book Now' buttons
                bookNowButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        modal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    });
                });
            
                // Event listener for the cancel (X) button
                closeModalButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                });
            
                // Room Search Functionality
                const searchRoomsBtn = document.querySelector('.search-rooms-btn');
                const roomsGrid = document.querySelector('.rooms-grid');
            
                searchRoomsBtn.addEventListener('click', () => {
                    // Your existing room filtering logic...
            
                    // Add event listeners to new book buttons after rendering
                    document.querySelectorAll('.room-card .book-now-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            modal.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                        });
                    });
                });
            });
        });
    });
;

// Function to reset booking form
function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    form.reset();
}

// Function to close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}
