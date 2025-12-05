# Projekt Mailbox
Brevlåda med sensor

## Syfte
* Underlätta för användaren att veta när ens post har nått brevlådan utan att själv behöva gå och kolla.

## Användare och kontext
* Användaren ska inte behöva gå ut och kolla posten ifall det inte finns någonting där.
* Användare med funktionsvariationer kan ha svårigheter med att gå ut och kolla i sin brevlåda. Genom att veta när de är post i deras brevlåda, slipper dem att gå och kolla i onödan.
  

## Ide 1.0
1. Ultrasonic distance sensor SR04 (ultraljudsensor) Att med hjälp av ultraljud känna när någonting ligger i brevlådan.
   
<img width="793" height="571" alt="image" src="https://github.com/user-attachments/assets/510254e9-3064-4967-b1b9-2557b8954ec5" />

2. Hittade instruktioner till koppling mellan miktokontroller, sensorn och datorn samt kod.
   
<img width="814" height="616" alt="image" src="https://github.com/user-attachments/assets/2f3ceb48-6c18-47f3-98f5-683a3222ed78" />
<img width="772" height="848" alt="image" src="https://github.com/user-attachments/assets/0a5009c0-4ce2-4c2d-8a68-c1bd65e9ad89" />
<img width="787" height="569" alt="image" src="https://github.com/user-attachments/assets/e09a0a6b-a388-48c1-bc51-2e9a36b719ba" />

3. Vi kopplade allting och gjorde lite tester. Man kan se att datan skiftade när jag placerade handen över sensorn.

<img width="522" height="705" alt="image" src="https://github.com/user-attachments/assets/fe56d501-ef14-4a87-9c82-0f07919fa108" />
<img width="520" height="725" alt="image" src="https://github.com/user-attachments/assets/30e622a3-c5ed-4b95-aeb1-8bf21c7bc1df" />
<img width="530" height="662" alt="image" src="https://github.com/user-attachments/assets/e8347ad4-4659-416f-bbb9-f7adfb9d26f7" />
<img width="532" height="695" alt="image" src="https://github.com/user-attachments/assets/44a632cf-fddf-41af-8856-450e6a8ae64f" />

4. Vi testade sensorn i brevlådan men den kunde inte känna någon större skillnad när det lades ner brev eller mindre paket i brevlådan. Därefter bestämde vi oss för att utesluta ultraljuds sensorn och istälelt gå över till infraröda sensorer.

## Ide 2.0
1. Magnet sensorer som ger ut data när magneterna har brutits.
2. Den ena mgneten sitter på kanten av locket i brevlådan och den andra magneten sitter mittemot den andra magneten i självaste lådan.
   <img width="400" height="800" alt="image" src="https://github.com/user-attachments/assets/0fa4d61a-bbcb-48af-bba1-264283327d38" />

## test med magnet sensor
1. Vi testade lite snabbt hur man kopplade mellan arduino och sensor.
2. Det här är hur vi kopplade och koden vi använde.
3. Det fungerade inte som vi hade hoppats, det fanns många delar i koden som inte fungerade för oss och vi va inte helt säkra på att våran koppling stämde.
4. Vi avvaktade att testa med resistorn tillsvidare. 
<img width="459" height="841" alt="image" src="https://github.com/user-attachments/assets/f5cf641c-e16d-47c9-9182-bf823c5a26d4" />

## Hur vi planerar att koppla elektroniken
<img width="3472" height="4624" alt="image" src="https://github.com/user-attachments/assets/6163bd9c-f1aa-43b0-be03-0faa096719bc" />


