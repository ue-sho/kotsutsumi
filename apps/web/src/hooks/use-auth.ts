import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi, type User, type SignupRequest, type LoginRequest } from '@/api/auth'

const USER_QUERY_KEY = ['user'] as const

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await authApi.me()
      return response.user
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData<User>(USER_QUERY_KEY, response.user)
      navigate('/')
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (response) => {
      queryClient.setQueryData<User>(USER_QUERY_KEY, response.user)
      navigate('/')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null)
      queryClient.clear()
      navigate('/login')
    },
  })
}
