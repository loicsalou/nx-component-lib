# Zas-web-components-1.1.6

## Classes communes  
Le package <i>common</i> contient des classes génériques estimées utiles pour toutes les applications.
A ce titre les concepts couverts par ces classes doivent être repris dans cette librairie et appliqués comme norme de base
à tous nos développements.

<h4 id="Message">Message</h4>
Toute application a le besoin d'émettre des messages susceptibles d'être présentés à l'utilisateur final.
La classe Message définit la base de tout message ayant cette vocation.
Un message se compose de:
* un niveau d'importance (énumération voir [MessageLevel](#MessageLevel))
* un titre facultatif (utile lorsque le message est présenté à l'utilisateur dans un popup par exemple)
* un message pouvant être:
 ** soit un message internationalisé dans la langue de l'utilisateur
 ** soit un message non encore internationalisé, devant être une clé dans un fichier de messages. L'application utilisatrice doit alors utiliser cette clé pour accéder à son propre catalogue de messages.
* des datas facultatives permettant le cas échéant de caractériser le message.

Exemple:
```Typescript
@Injectable()
export class SimpleMessageService extends MessageService {

  constructor() {
    super();
    this.source = new BehaviorSubject<string>(<string>{});
    this.messageSource$ = this.source.asObservable();
  }
[...]
  //show an error message
  errorMessage(text: string, title?: string, data?: [ any ]) {
    this.showMessage(MessageLevel.Error, text, title, data);
  }

  //show a message after translation if it was required
  protected showMessage(level: MessageLevel, text: string, title?: string, data ?: any) {
    this.source.next(new Message(level, text, title, data));
  }

}

```

<h4 id="MessageLevel">MessageLevel</h4>
Enumération des niveaux de gravité supportés.
* _Success_ indique que l'opération a fonctionné 
* _Error_ indique qu'une erreur a empêché l'opération de s'effectuer
* _Warning_ indique une situation potentiellement anormale
* _Info_ indique un simple message d'information

