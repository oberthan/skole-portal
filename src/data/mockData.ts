import { Elev, Lærer, Klasse, Fag, Lokale, Skema } from '@/types/school';

export const klasser: Klasse[] = [
  { id: '1', navn: '1.A', årgang: 2024 },
  { id: '2', navn: '1.B', årgang: 2024 },
  { id: '3', navn: '2.A', årgang: 2023 },
  { id: '4', navn: '2.B', årgang: 2023 },
  { id: '5', navn: '3.A', årgang: 2022 },
];

export const fag: Fag[] = [
  { id: '1', navn: 'Dansk', beskrivelse: 'Sprog og litteratur' },
  { id: '2', navn: 'Matematik', beskrivelse: 'Tal og geometri' },
  { id: '3', navn: 'Engelsk', beskrivelse: 'Fremmedsprog' },
  { id: '4', navn: 'Fysik', beskrivelse: 'Naturvidenskab' },
  { id: '5', navn: 'Historie', beskrivelse: 'Samfund og kultur' },
];

export const elever: Elev[] = [
  { id: '1', navn: 'Anna Jensen', email: 'anna@skole.dk', klasse_id: '1' },
  { id: '2', navn: 'Magnus Pedersen', email: 'magnus@skole.dk', klasse_id: '1' },
  { id: '3', navn: 'Sofie Nielsen', email: 'sofie@skole.dk', klasse_id: '2' },
  { id: '4', navn: 'Oliver Hansen', email: 'oliver@skole.dk', klasse_id: '2' },
  { id: '5', navn: 'Emma Larsen', email: 'emma@skole.dk', klasse_id: '3' },
  { id: '6', navn: 'William Andersen', email: 'william@skole.dk', klasse_id: '3' },
  { id: '7', navn: 'Ida Christensen', email: 'ida@skole.dk', klasse_id: '4' },
  { id: '8', navn: 'Noah Mortensen', email: 'noah@skole.dk', klasse_id: '5' },
];

export const lærere: Lærer[] = [
  { id: '1', navn: 'Henrik Thomsen', email: 'henrik@skole.dk', fag_id: '1' },
  { id: '2', navn: 'Mette Olsen', email: 'mette@skole.dk', fag_id: '2' },
  { id: '3', navn: 'Lars Rasmussen', email: 'lars@skole.dk', fag_id: '3' },
  { id: '4', navn: 'Karen Sørensen', email: 'karen@skole.dk', fag_id: '4' },
  { id: '5', navn: 'Peter Møller', email: 'peter@skole.dk', fag_id: '5' },
];

export const lokaler: Lokale[] = [
  { id: '1', navn: 'Lokale 101' },
  { id: '2', navn: 'Lokale 102' },
  { id: '3', navn: 'Lokale 201' },
  { id: '4', navn: 'Lokale 202' },
  { id: '5', navn: 'Gymnastiksalen' },
];

export const skemaer: Skema[] = [
  { id: '1', klasse_id: '1', fag_id: '1', lærer_id: '1', lokale_id: '1', tidspunkt: 'Man 08:00-09:30' },
  { id: '2', klasse_id: '1', fag_id: '2', lærer_id: '2', lokale_id: '2', tidspunkt: 'Man 10:00-11:30' },
  { id: '3', klasse_id: '1', fag_id: '3', lærer_id: '3', lokale_id: '1', tidspunkt: 'Tir 08:00-09:30' },
  { id: '4', klasse_id: '2', fag_id: '4', lærer_id: '4', lokale_id: '3', tidspunkt: 'Man 08:00-09:30' },
  { id: '5', klasse_id: '2', fag_id: '5', lærer_id: '5', lokale_id: '4', tidspunkt: 'Tir 10:00-11:30' },
  { id: '6', klasse_id: '3', fag_id: '1', lærer_id: '1', lokale_id: '2', tidspunkt: 'Ons 08:00-09:30' },
  { id: '7', klasse_id: '3', fag_id: '2', lærer_id: '2', lokale_id: '1', tidspunkt: 'Tor 10:00-11:30' },
];
