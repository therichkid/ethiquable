export const ROUTER_ITEMS = [
  {
    icon: "mdi-home",
    title: "Home",
    to: "/"
  },
  {
    icon: "mdi-newspaper",
    title: "Neuigkeiten",
    to: "/news"
  },
  {
    icon: "mdi-calendar",
    title: "Veranstaltungen",
    to: "/events"
  },
  {
    icon: "mdi-account-multiple",
    title: "Selbsthilfegruppen",
    to: "/shgs"
  },
  {
    icon: "mdi-ear-hearing",
    title: "Cochlea-Implantat",
    to: [
      {
        title: "Erfahrungen",
        to: "/erfahrungen"
      },
      {
        title: "Was ist ein CI?",
        to: "/was-ist-ein-ci"
      },
      {
        title: "Kliniken, Rehas, Beratungsstellen",
        to: "/einrichtungen"
      },
      {
        title: "CI-Systeme",
        to: "/ci-systeme"
      }
    ]
  },
  {
    icon: "mdi-information",
    title: "Über uns",
    to: [
      {
        title: "Verband",
        to: "/verband"
      },
      {
        title: "Beratung",
        to: "/beratung"
      },
      {
        title: "Vorstand",
        to: "/vorstand"
      },
      {
        title: "Förderer",
        to: "/foerderer"
      },
      {
        title: "Satzung",
        to: "/satzung"
      },
      {
        title: "Infos & Dokumente",
        to: "/infos-dokumente"
      }
    ]
  },
  {
    icon: "mdi-clipboard-account",
    title: "Kontakt",
    to: "/kontakt"
  },
  {
    icon: "mdi-account-plus",
    title: "Mitglied werden",
    to: "/mitglied-werden"
  }
];
