import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.BASE_API_GATEWAY_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${env.BEARER_TOKEN_API}`,
    DeviceToken: 'd822f9a9-adc4-4509-9c92-d5d920320df2',
  },
})
