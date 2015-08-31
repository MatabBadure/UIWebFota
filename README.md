# qogir
This is a Angular code for the Hill-Rom Vest project.

## Libraries used
* Angular.js : 1.4
* nvd3 : 0.0.7
* Angular recaptcha : 2.2.4
* Angular-loading-bar : 0.8.0

Other libraries are in the bower.json. 

## Build procedure
* Global libraries to have in the developer machine:
    - node.js - 0.12.0
    - npm
    - grunt 
    - bower
* Run npm install
* Run bower install
* grunt serve --force should get the application up and running on port 9000. Accessible @http://localhost:9000

## Proxy configurations for the development.
Currently grunt proxy is configured to point to dev.hillromvest.com:8080. This can be changed to anything developer wants
to while debugging.