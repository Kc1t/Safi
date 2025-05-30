import { useEffect, useState } from "react"

interface UseAutoSubmitMessageProps {
  messages: any[]
  input: string
  initialMessage?: string
  setInput: (value: string) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function useAutoSubmitMessage({
  messages,
  input,
  initialMessage,
  setInput,
  handleSubmit,
}: UseAutoSubmitMessageProps) {
  const [autoSubmitReady, setAutoSubmitReady] = useState(false)

  // Preenche o input com a mensagem inicial, se não houver mensagens
  useEffect(() => {
    if (messages.length === 0 && initialMessage && !input) {
      setInput(initialMessage)
      setAutoSubmitReady(true)
    }
  }, [messages.length, initialMessage, input, setInput])

  // Envia automaticamente após setInput (quando estiver pronto)
  useEffect(() => {
    if (autoSubmitReady && input) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
      setAutoSubmitReady(false)
    }
  }, [autoSubmitReady, input, handleSubmit])

  return {
    autoSubmitReady,
    setAutoSubmitReady,
  }
}
