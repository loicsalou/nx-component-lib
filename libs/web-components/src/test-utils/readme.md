## test-utils  
Ce package fournit des utilitaires intéressants pour les tests effectués avec Jasmine.
Il provient du site [http://angular.io] et fournit les services suivants:
 
 * newEvent(eventName: string, bubbles = false, cancelable = false) pour créer un événement javascript susceptible de 
 faire réagir un composant sous test.
 
 * click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): simule un click sur un élément sous test.

 * la directive *\[routerLink\]* pour mocker le vrai routerLink et éviter d'avoir à gérer la quasi totalité de l'application 
 dans un test unitaire. Cette directive émet un événement *click* qui déclenche la fonction *onClick()* du host
 
 * le composant \<router-outlet\> pour mocker le vrai router-outlet, pour les mêmes raisons. Ce composant n'affichera rien lors
 d'une navigation, il se contentera de se substituer au router-outlet.
 
 * le module *TestingHelpersModule* qui export la précédente directive et le précédent composant.
 
 ### exemples
 
 