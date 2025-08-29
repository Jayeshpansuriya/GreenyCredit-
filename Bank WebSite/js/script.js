document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.createElement('div');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(mobileNavToggle);

    mobileNavToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
        this.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.style.display = 'none');
        testimonials[index].style.display = 'block';
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    if (testimonials.length > 0) {
        showTestimonial(currentTestimonial);
        setInterval(nextTestimonial, 5000);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Loan EMI Calculator
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateEMI);
    }

    function calculateEMI() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const loanTenure = parseFloat(document.getElementById('loan-tenure').value);

        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
            alert('Please enter valid values for all fields.');
            return;
        }

        const monthlyInterestRate = interestRate / 12 / 100;
        const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenure) / (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);
        const totalPayment = emi * loanTenure;
        const totalInterest = totalPayment - loanAmount;

        document.getElementById('monthly-emi').textContent = '₹ ' + emi.toFixed(2);
        document.getElementById('total-interest').textContent = '₹ ' + totalInterest.toFixed(2);
        document.getElementById('total-payment').textContent = '₹ ' + totalPayment.toFixed(2);
    }

    // Deposit Calculator
    const calculateDepositBtn = document.getElementById('calculate-deposit-btn');
    if (calculateDepositBtn) {
        calculateDepositBtn.addEventListener('click', calculateDeposit);
    }

    const depositTypeSelect = document.getElementById('deposit-type');
    if (depositTypeSelect) {
        depositTypeSelect.addEventListener('change', toggleDepositInputs);
        toggleDepositInputs(); // Initial toggle
    }

    function toggleDepositInputs() {
        const depositType = document.getElementById('deposit-type').value;
        const principalGroup = document.getElementById('principal-group');
        const monthlyDepositGroup = document.getElementById('monthly-deposit-group');
        const dailyDepositGroup = document.getElementById('daily-deposit-group');

        // Hide all deposit input groups first
        principalGroup.style.display = 'none';
        monthlyDepositGroup.style.display = 'none';
        dailyDepositGroup.style.display = 'none';

        // Show relevant input groups based on deposit type
        if (depositType === 'fd') {
            principalGroup.style.display = 'block';
        } else if (depositType === 'rd') {
            monthlyDepositGroup.style.display = 'block';
        } else if (depositType === 'drd') {
            dailyDepositGroup.style.display = 'block';
        }
    }

    function calculateDeposit() {
        const depositType = document.getElementById('deposit-type').value;
        const interestRate = parseFloat(document.getElementById('deposit-interest').value);
        const years = parseInt(document.getElementById('deposit-years').value) || 0;
        const months = parseInt(document.getElementById('deposit-months').value) || 0;

        const totalMonths = years * 12 + months;

        if (totalMonths <= 0) {
            alert('Please enter a valid tenure.');
            return;
        }

        if (isNaN(interestRate)) {
            alert('Please enter a valid interest rate.');
            return;
        }

        let totalInvestment = 0;
        let maturityValue = 0;

        if (depositType === 'fd') {
            const principalAmount = parseFloat(document.getElementById('principal-amount').value);
            if (isNaN(principalAmount)) {
                alert('Please enter a valid principal amount.');
                return;
            }

            totalInvestment = principalAmount;
            const r = interestRate / 100;
            maturityValue = principalAmount * Math.pow(1 + r / 4, 4 * totalMonths / 12);
        } else if (depositType === 'rd') {
            const monthlyDeposit = parseFloat(document.getElementById('monthly-deposit').value);
            if (isNaN(monthlyDeposit)) {
                alert('Please enter a valid monthly deposit amount.');
                return;
            }

            totalInvestment = monthlyDeposit * totalMonths;
            const r = interestRate / 100 / 12;
            maturityValue = monthlyDeposit * ((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r);
        } else if (depositType === 'drd') {
            const dailyDeposit = parseFloat(document.getElementById('daily-deposit').value);
            if (isNaN(dailyDeposit)) {
                alert('Please enter a valid daily deposit amount.');
                return;
            }
 
            const daysInMonth = 30; // Assuming 30 days per month for simplicity
            const totalDays = totalMonths * daysInMonth;
            totalInvestment = dailyDeposit * totalDays;
            const r = interestRate / 100 / 365;
            maturityValue = dailyDeposit * ((Math.pow(1 + r, totalDays) - 1) / r) * (1 + r);
        }

        const interestEarned = maturityValue - totalInvestment;

        document.getElementById('total-investment').textContent = '₹ ' + totalInvestment.toFixed(2);
        document.getElementById('interest-earned').textContent = '₹ ' + interestEarned.toFixed(2);
        document.getElementById('maturity-value').textContent = '₹ ' + maturityValue.toFixed(2);
    }

    // Contact Form Submission
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    inquiryType: document.getElementById('inquiry-type').value,
                    message: document.getElementById('message').value.trim(),
                    consent: document.getElementById('consent').checked
                };
                
                // Basic client-side validation
                if (!formData.name || !formData.email || !formData.inquiryType || !formData.message || !formData.consent) {
                    throw new Error('Please fill in all required fields and accept the privacy policy.');
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                // Send data to backend
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    inquiryForm.style.display = 'none';
                    document.getElementById('form-success').style.display = 'block';
                    
                    // Reset form
                    inquiryForm.reset();
                    
                    // Scroll to success message
                    document.getElementById('form-success').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                } else {
                    // Handle validation errors from server
                    if (result.errors && result.errors.length > 0) {
                        const errorMessages = result.errors.map(error => error.msg).join('\n');
                        throw new Error(errorMessages);
                    } else {
                        throw new Error(result.message || 'There was an error sending your message.');
                    }
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                
                // Show error message to user
                let errorMessage = error.message;
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMessage = 'Unable to connect to the server. Please check if the backend is running and try again.';
                }
                
                alert(errorMessage);
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Loan Calculator Button Links
    const loanCalculatorBtns = document.querySelectorAll('.loan-calculator-btn');
    loanCalculatorBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const loanType = this.getAttribute('data-loan-type');
            window.location.href = 'loans.html#loan-calculator';
            
            // In a more advanced implementation, you could pre-fill the calculator with values based on the loan type
            // This would require additional JavaScript to handle the values after the page loads/scrolls
        });
    });

    // Deposit Calculator Button Links
    const fdCalculatorBtn = document.querySelector('.fd-calculator-btn');
    const rdCalculatorBtn = document.querySelector('.rd-calculator-btn');
    const drdCalculatorBtn = document.querySelector('.drd-calculator-btn');

    if (fdCalculatorBtn) {
        fdCalculatorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // First navigate to the calculator section
            const calculatorSection = document.querySelector('#deposit-calculator');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({ behavior: 'smooth' });
                // Then set the deposit type
                const depositTypeSelect = document.getElementById('deposit-type');
                if (depositTypeSelect) {
                    depositTypeSelect.value = 'fd';
                    // Trigger change event to update form
                    depositTypeSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    if (rdCalculatorBtn) {
        rdCalculatorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // First navigate to the calculator section
            const calculatorSection = document.querySelector('#deposit-calculator');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({ behavior: 'smooth' });
                // Then set the deposit type
                const depositTypeSelect = document.getElementById('deposit-type');
                if (depositTypeSelect) {
                    depositTypeSelect.value = 'rd';
                    // Trigger change event to update form
                    depositTypeSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    if (drdCalculatorBtn) {
        drdCalculatorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // First navigate to the calculator section
            const calculatorSection = document.querySelector('#deposit-calculator');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({ behavior: 'smooth' });
                // Then set the deposit type
                const depositTypeSelect = document.getElementById('deposit-type');
                if (depositTypeSelect) {
                    depositTypeSelect.value = 'drd';
                    // Trigger change event to update form
                    depositTypeSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }
    
    // Handle scrolling to deposit calculator section when page loads with hash
    function handleDepositCalculatorHash() {
        if (window.location.hash === '#deposit-calculator') {
            const calculatorSection = document.querySelector('#deposit-calculator');
            if (calculatorSection) {
                // Add a small delay to ensure the page is fully loaded
                setTimeout(() => {
                    calculatorSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }
    
    // Run when page loads
    handleDepositCalculatorHash();
    
    // Also run when hash changes (for browser back/forward navigation)
    window.addEventListener('hashchange', handleDepositCalculatorHash);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add active class to navigation based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Add responsive styles for mobile navigation
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @media (max-width: 768px) {
            nav {
                display: none;
                width: 100%;
                padding-top: 10px;
            }
            
            nav.active {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
                align-items: center;
            }
            
            nav ul li {
                margin: 10px 0;
            }
            
            .mobile-nav-toggle {
                display: block;
                cursor: pointer;
                font-size: 1.5rem;
                color: #004080;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-nav-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleElement);
});

// Enhanced Testimonial Slider with Navigation
let testimonialIndex = 1;
showTestimonials(testimonialIndex);

function moveTestimonial(n) {
    showTestimonials(testimonialIndex += n);
}

function currentTestimonial(n) {
    showTestimonials(testimonialIndex = n);
}

function showTestimonials(n) {
    let i;
    let testimonials = document.getElementsByClassName("testimonial");
    let dots = document.getElementsByClassName("dot");
    
    if (n >= testimonials.length) {testimonialIndex = 0}
    if (n < 0) {testimonialIndex = testimonials.length-1}
    
    for (i = 0; i < testimonials.length; i++) {
        testimonials[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
        dots[i].style.backgroundColor = "#bbb";
    }
    
    testimonials[testimonialIndex].style.display = "block";
    dots[testimonialIndex].className += " active";
    dots[testimonialIndex].style.backgroundColor = "#2e8b57";
}

// Auto-advance testimonials
setInterval(function() {
    moveTestimonial(1);
}, 5000);