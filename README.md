# MRP Reference Application

This application demonstrates the Da Vinci MRP medication reconcilation use case.
Please see the code for details.

## Configure

Update `launch.html` with your app's OAuth client ID.

## Install & Run
Install NodeJS. Then fetch the app dependencies in the app directory and launch the app server:
```sh
npm i
npm start
```

You should see something like

    Starting up http-server, serving ./
    Available on:
        http://127.0.0.1:8080
        http://10.23.49.21:8080

You can stop the server if needed using <kbd>Ctrl+C</kbd>.

At this point your Launch URI is http://127.0.0.1:8080/launch.html and your
Redirect URI is http://127.0.0.1:8080.

## Building Releases
A Dockerfile is included for customization to easily distribute complete application images. For example:

    docker build -t hspc/davinci-mrp-payer:latest .
    docker run -it --name davinci-mrp-payer --rm -p 9090:9090 hspc/davinci-mrp-payer:latest