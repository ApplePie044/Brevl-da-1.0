# Projekt Mailbox
Brevlåda med sensor

## Syfte
* Underlätta för användaren att veta när ens post har nått brevlådan utan att själv behöva gå och kolla.

## Användare och kontext
* Användaren ska inte behöva gå ut och kolla posten ifall det inte finns någonting där.
* Det kan vara svårt för användare med vissa funktionsvariationer att flera gånger under dagen gå och kolla i sin brevlåda.
* 

## Ide 1.0
1. Ultrasonic distance sensor SR04 (ultraljudsensor) Att med hjälp av ultraljud känna när någonting ligger i brevlådan.
   
<img width="793" height="571" alt="image" src="https://github.com/user-attachments/assets/510254e9-3064-4967-b1b9-2557b8954ec5" />

3. Hittade instruktioner till koppling mellan miktokontroller, sensorn och datorn samt kod.
   
<img width="814" height="616" alt="image" src="https://github.com/user-attachments/assets/2f3ceb48-6c18-47f3-98f5-683a3222ed78" />
<img width="772" height="848" alt="image" src="https://github.com/user-attachments/assets/0a5009c0-4ce2-4c2d-8a68-c1bd65e9ad89" />
<img width="787" height="569" alt="image" src="https://github.com/user-attachments/assets/e09a0a6b-a388-48c1-bc51-2e9a36b719ba" />

4. Vi kopplade allting och gjorde lite tester. Man kan se att datan skiftade när jag placerade handen över sensorn.

<img width="522" height="705" alt="image" src="https://github.com/user-attachments/assets/fe56d501-ef14-4a87-9c82-0f07919fa108" />
<img width="520" height="725" alt="image" src="https://github.com/user-attachments/assets/30e622a3-c5ed-4b95-aeb1-8bf21c7bc1df" />
<img width="530" height="662" alt="image" src="https://github.com/user-attachments/assets/e8347ad4-4659-416f-bbb9-f7adfb9d26f7" />
<img width="532" height="695" alt="image" src="https://github.com/user-attachments/assets/44a632cf-fddf-41af-8856-450e6a8ae64f" />

5. Vi testade sensorn i brevlådan men den kunde inte känna någon större skillnad när det lades ner brev eller mindre paket i brevlådan. Därefter bestämde vi oss för att utesluta ultraljuds sensorn och istälelt gå över till infraröda sensorer.

## Ide 2.0
1. Infraröda sensorer som ger ut data när någonting har brutit strålen.
2. Det sitter en på varsin sida innuti brevlådan som formar ljuset som ett slags nät för att kunna känna av oavsätt hur litet brevet/paketet är. Vi vill alltså ha mer träffyta. 
