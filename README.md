<br />
<p align="center">
<div align="center">
  <img height="150" src="https://raw.githubusercontent.com/aryairama/telegram-next-js/main/screenshots/logo.png"/>
</div>
  <h3 align="center">Backend Telegram Clone</h3>
  <p align="center">
    <a href="https://github.com/aryairama/telegram-express-js"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://bit.ly/vehicle_rental">View Demo</a>
    ·
    <a href="https://github.com/aryairama/telegram-express-js/issues">Report Bug</a>
    ·
    <a href="https://github.com/aryairama/telegram-express-js/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env example](#setup-env-example)
- [Rest Api](#rest-api)
- [Contributing](#contributing)
- [Related Project](#related-project)
- [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This api is for my telegram clone application, one of which is to handle realtime chat, offline/online user status, realtime delete chat, update user profile, and others.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer]('https://nodemailer.com/about/')
- and other

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [nodejs](https://nodejs.org/en/download/)

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](database-example.sql)

### Installation

- Clone This Back End Repo
```
git clone https://github.com/aryairama/telegram-express-js
```
- Go To Folder Repo
```
cd telegram-express-js
```
- Install Module
```
npm install
```
- Development mode
```
npm run serve
```
- Deploy mode
```
npm start
```

### Setup .env example

Create .env file in your root project folder.

```env
# Database
DB_HOST = [DB_HOST]
DB_USER = = [DB_USER]
DB_NAME = [DB_NAME]
DB_PASSWORD = [DB_PASSWORD]
DB_PORT = [DB_PORT]
# Aplication
PORT = [PORT_APLICATION]
# Secret key for jwt token
ACCESS_TOKEN_SECRET = [SECRET_KEY_JWT]
REFRESH_TOKEN_SECRET = [SECRET_KEY_JWT]
VERIF_EMAIL_TOKEN_SECRET = [SECRET_KEY_JWT]
FORGOT_PASSWORD_TOKEN_SECRET = [SECRET_KEY_JWT]
# Redis
HOST_REDIS = [REDIS_HOST]
PORT_REDIS = [REDIS_PORT]
AUTH_REDIS = [REDIS_AUTH]
PATH_REDIS = [REDIS_UNIX_SOCKET]
PREFIX_REDIS = [PREFIX-REDIS]
# IP/SOCKET
# Sendmailer SMTP
NODEMAILER_HOST = [SMTP_HOST]
NODEMAILER_PORT = [SMTP_PORT]
NODEMAILER_SECURE = [OPTION_SECURE_SMTP]
NODEMAILER_AUTH_USER = [USER_SMTP]
NODEMAILER_AUTH_PASS = [PASSWORD_SMTP]
# FrontEnd
URL_FRONTEND = [URL_FRONT_END]
# Origin Cookie
CORS_ORIGIN = ['http://localhost:3000','http://localhost:4000']
CREDENTIALS = [TRUE/FALSE]
```

## Rest Api

You can view my Postman collection [here](https://www.postman.com/crimson-meadow-842892/workspace/Telegram-Clone~eea3df8d-1aca-4df2-920b-d8a9d5e1e0d6/collection/10655215-e9feb563-0dd8-4675-b396-eece73f7525e)
</br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/10655215-e9feb563-0dd8-4675-b396-eece73f7525e?action=collection%2Ffork&collection-url=entityId%3D10655215-e9feb563-0dd8-4675-b396-eece73f7525e%26entityType%3Dcollection%26workspaceId%3Deea3df8d-1aca-4df2-920b-d8a9d5e1e0d6)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Related Project
:rocket: [`Backend Telegram Clone`](https://github.com/aryairama/telegram-express-js)

:rocket: [`Frontend Telegram Clone`](https://github.com/aryairama/telegram-next-js)

:rocket: [`Demo Telegram Clone`](https://bit.ly/telegram_next)

<!-- CONTACT -->
## Contact

My Email : aryairama987@gmail.com

Project Link: [https://github.com/aryairama/telegram-express-js](https://github.com/aryairama/telegram-express-js)





