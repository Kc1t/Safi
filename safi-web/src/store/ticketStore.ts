import { create } from "zustand"

export type TicketData = {
  nome: string;
  contato: string;
  setor: string;
  tipoProblema?: string;
  descricao: string;
  concordo: boolean;
};

type TicketStore = {
  ticket: TicketData;
  setTicket: (data: TicketData) => void;
  resetTicket: () => void;
};

export const useTicketStore = create<TicketStore>((set) => ({
  ticket: {
    nome: "",
    contato: "",
    setor: "recursos-humanos",
    tipoProblema: "login-conta",
    descricao: "",
    concordo: false,
  },
  setTicket: (data) => set({ ticket: data }),
  resetTicket: () =>
    set({
      ticket: {
        nome: "",
        contato: "",
        setor: "recursos-humanos",
        tipoProblema: "login-conta",
        descricao: "",
        concordo: false,
      },
    }),
}))
