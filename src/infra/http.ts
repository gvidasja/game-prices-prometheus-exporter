import http from 'http'
import https from 'https'

class HttpResponse {
  statusCode?: number
  body?: any
}

const processResponse = (onSuccess: (r: HttpResponse) => void, onError: (e: any) => void) => (response: http.IncomingMessage) => {
  let body = ''

  response.on('data', data => body += data)
  response.on('error', error => onError({ statusCode: response.statusCode, data: error }))

  response.on('end', () =>
    onSuccess({
      statusCode: response.statusCode,
      body
    })
  )
}

export const get = (url: string) => new Promise<HttpResponse>((resolve, reject) =>
  https.get(url, processResponse(resolve, reject))
)