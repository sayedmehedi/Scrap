import React from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday'
import { useAppSelector } from '@hooks/store';
import { View, SectionList } from 'react-native';
import isYesterday from 'dayjs/plugin/isYesterday'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Title, Text, useTheme } from 'react-native-paper';
import { selectIsAuthenticated } from '@store/slices/authSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthStackRoutes, RootStackRoutes } from '@constants/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GetNotificationsResponse, AppNotification, PaginationQueryParams, RootStackParamList } from '@src/types';
import { useGetNotificationsQuery, useLazyGetNotificationsQuery } from '@data/laravel/services/auth';

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

type Props = NativeStackScreenProps<RootStackParamList, typeof RootStackRoutes.NOTIFICATIONS>

export default function NotificationsScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [getNotifications, { isFetching }] = useLazyGetNotificationsQuery({});
  const { data: getNotificationsResponse, isLoading } = useGetNotificationsQuery({}, {
    skip: !isAuthenticated
  });
  const actionCreaterRef = React.useRef<ReturnType<typeof getNotifications> | null>(null);
  const [notificationPages, setNotificationPages] = React.useState<Array<GetNotificationsResponse["notifications"]>>([]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace(RootStackRoutes.AUTH, {
        screen: AuthStackRoutes.LOGIN,
        params: {
          nextScreen: {
            name: route.name,
            params: route.params ?? {}
          }
        }
      })
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    if (!isLoading && !!getNotificationsResponse) {
      setNotificationPages([getNotificationsResponse.notifications])
    }
  }, [getNotificationsResponse, isLoading])

  const getNextNotifications = async () => {
    if (isFetching || isLoading || !isAuthenticated) {
      return;
    }

    const lastProductPage = notificationPages[notificationPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {}

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = getNotifications(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setNotificationPages(prevPages => {
        return prevPages.concat(productResponse.notifications)
      })
    } finally {
    }
  }

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {

        actionCreaterRef.current.abort()
      }
    }
  }, [])

  const notifications = React.useMemo(() => {
    if (isLoading) {
      return [{
        title: "Today",
        data: [{
          id: 1,
          type: "skeleton" as const
        },
        {
          id: 2,
          type: "skeleton" as const
        },
        {
          id: 3,
          type: "skeleton" as const
        }]
      },
      {
        title: "Yesterday",
        data: [{
          id: 1,
          type: "skeleton" as const
        },
        {
          id: 2,
          type: "skeleton" as const
        },
        {
          id: 3,
          type: "skeleton" as const
        }]
      }]
    }

    const notificationByDate: Record<"Today" | "Yesterday" | string, (AppNotification & { type: "data" })[]> = {
      Today: [],
      Yesterday: [],
    }

    notificationPages.forEach(notificationPage => {
      notificationPage.data.forEach(notification => {
        const isToday = dayjs(notification.date).isToday()
        const isYesterday = dayjs(notification.date).isYesterday();

        if (isToday) {
          notificationByDate.Today.push({
            type: "data",
            ...notification
          })
        } else if (isYesterday) {
          notificationByDate.Yesterday.push({
            type: "data",
            ...notification
          })
        } else {
          const date = dayjs(notification.date).format("DD MMM YYYY")

          if (!notificationByDate[date]) {
            notificationByDate[date] = []
          }

          notificationByDate[date].push({
            type: "data",
            ...notification
          })
        }
      })
    })


    return Object.entries(notificationByDate).map(([title, data]) => ({
      title,
      data
    }))
  }, [isLoading, notificationPages])

  return isAuthenticated ? (
    <View style={{ padding: 15 }}>

      <SectionList<typeof notifications[0]["data"][0]>
        sections={notifications}
        keyExtractor={(item, index) => `${item.id + index}`}
        contentContainerStyle={{
          paddingBottom: 50
        }}
        onEndReached={getNextNotifications}
        renderSectionHeader={({ section: { title } }) => (
          <Title style={{ marginBottom: 15 }}>{title}</Title>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={{ textAlign: "center" }}>No data</Text>
          </View>
        )}
        renderItem={({ item }) => {
          if (item.type === "skeleton") {
            return (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item paddingBottom={15}>
                  <SkeletonPlaceholder.Item height={100} borderRadius={5} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )
          }

          return (
            <View
              style={{
                padding: 15,
                marginBottom: 15,
                flexDirection: 'row',
                borderRadius: theme.roundness * 3,
                // @ts-ingore
                backgroundColor: theme.colors.white,
              }}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  //   marginRight: 15,
                  borderRadius: 1000,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(81, 183, 100, 0.25)',
                }}>
                <MaterialIcons
                  size={22}
                  color={'#51B764'}
                  name="notifications-none"
                />
              </View>

              <View style={{ flex: 1, paddingLeft: 15 }}>
                <View
                  style={{
                    marginBottom: 15,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#F04E26',
                      fontWeight: '700',
                    }}>
                    {item.title}
                  </Text>

                  <Text>{dayjs(item.date).isToday() ? dayjs(item.date).fromNow() : dayjs(item.date).format("HH:mm A")}</Text>
                </View>

                <Text style={{
                  color: theme.colors.tertiary
                }}>
                  {item.message}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </View >
  ) : null;
}
