import { Language } from '../fixtures';
import { JaDictionary } from './ja';
import { EnDictionary } from './en';
import { Dictionary } from './base';

function getDictionary(language: Language): Dictionary {
  switch (language) {
    case Language.Ja:
      return new JaDictionary();
    case Language.En:
      return new EnDictionary();
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

export {
  getDictionary,
  type Dictionary,
};
