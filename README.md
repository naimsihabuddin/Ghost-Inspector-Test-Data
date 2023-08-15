# Ghost-Inspector-Test-Data

Extracting test data used in tests of a specific suite in Ghost Inspector

## Overview

Traditionally, it's required to individually access each test within a suite to identify the variables that have been utilized. Furthermore, there's currently no method available to compare all the variables that are employed across all tests within a suite.

<img width="1105" alt="image" src="https://github.com/naimsihabuddin/Ghost-Inspector-Test-Data/assets/74947567/1201a2b9-1ddc-47ba-9a3a-021038c7cbca">

<img width="1105" alt="image" src="https://github.com/naimsihabuddin/Ghost-Inspector-Test-Data/assets/74947567/31ed58d2-ab2e-41e2-b314-c7b9399f0d08">

Nevertheless, with this solution in place, we are now capable of achieving this.

## How to get started

1. Login to Ghost Inspector and get your API key from [your profile screen](https://app.ghostinspector.com/account)
2. Get Suite ID from GI Suite url eg. https://app.ghostinspector.com/suites/{{suite_id}}
3. Open folder with VS Code
4. Update the `<placeholders>` in [script.js](script.js) file with your API key and Suite ID obtained in the previous steps.
5. Install [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
6. On bottom right of the screen, click on `Go Live`

   <img width="1792" alt="image" src="https://user-images.githubusercontent.com/94157197/233846790-01c8f35d-4d65-4c45-91ac-c6dfb09ac019.png">
   
   If successful, you should be able to see something like this

   <img width="1792" alt="image" src="https://user-images.githubusercontent.com/94157197/233846310-c342c8ff-0fbd-4c52-92f7-7f7f495be9c2.png">
