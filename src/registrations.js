const SendRegistration = async (data) => {
    try {
        const response = await fetch('https://backend-esc.onrender.com/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data) 
        });

        const result = await response.json();

        if (!response.ok) {

            return {
                success: false,
                error: result.error || 'Failed to register user',
                status: response.status
            };
        }

        console.log('✅ User registered successfully');
        return {
            success: true,
            data: result,
            message: 'Registration successful'
        };

    } catch (error) {

        console.error('❌ Network error:', error);
        return {
            success: false,
            error: 'Network error. Please check your connection.',
            networkError: true
        };
    }
};


export default SendRegistration

