import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alertService';
import { ALERTS_QUERY_KEY } from './useAlerts';

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertService.createAlert,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertService.deleteAlert,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
};
