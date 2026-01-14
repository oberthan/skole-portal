export interface Bruger {
  id: string;
  navn: string;
  email: string;
  rolle: 'admin' | 'lærer' | 'elev';
}

export interface Elev {
  id: string;
  navn: string;
  email: string;
  klasse_id: string;
}

export interface Fag {
  id: string;
  navn: string;
  beskrivelse?: string;
}

export interface Karakter {
  id: string;
  elev_id: string;
  fag_id: string;
  karakter: string;
}

export interface Klasse {
  id: string;
  navn: string;
  årgang: number;
}

export interface Lærer {
  id: string;
  navn: string;
  email: string;
  fag_id: string;
}

export interface Lokale {
  id: string;
  navn: string;
}

export interface Skema {
  id: string;
  klasse_id: string;
  fag_id: string;
  lærer_id: string;
  lokale_id: string;
  tidspunkt: string;
}
