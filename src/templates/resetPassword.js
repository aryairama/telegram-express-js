const verifEmail = (token, name) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .body {
            padding: 1.5rem;
            background-color: rgb(247, 244, 244);
        }

        .container {
            border: 2px solid rgba(0, 0, 0, 0.171);
            width: 450px;
            background-color: white;
            margin-left: auto;
            margin-right: auto;
            border-radius: 10px;
            padding: 20px;
        }

        .text-brand {
            display: inline-block;
            width: 80%;
            font-weight: bold;
            font-size: 40px;
            padding-top: 10px;
            color: #7E98DF !important;
        }

        .mt-1 {
            margin-top: 1rem;
        }

        .text-announcement {
            width: 100%;
            margin-top: 1rem;
            font-weight: bold;
            font-size: 25px;
        }

        .text-description {
            width: 100%;
            margin-top: 0.5rem;
            color: #94929a !important;
        }

        .button-verify {
            width: 100%;
            display: block;
            cursor: pointer;
            margin-top: 1.5rem;
            margin-bottom: 0.4rem;
            width: 100%;
            text-align: center;
            padding: 10px 0px;
            background-color: #7E98DF;
            color: #ffffff !important;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="body">
        <div class="container">
            <div>
                <p class="text-brand">Telegram</p>
            </div>
            <div>
                <p class="text-announcement">Reset Password</p>
                <p class="text-description">Hi ${name}! Use the link below to reset your password and start chatting with other.
                </p>
                <a target="_blank" href="${process.env.URL_FRONTEND}/auth/forgot-password/${token}" class="button-verify">Reset Password</a>
            </div>
        </div>
    </div>
</body>

</html>`;

module.exports = verifEmail;
