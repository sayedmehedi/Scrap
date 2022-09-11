import React from 'react';
import { Divider, Title } from 'react-native-paper';
import { ListItem, Button } from 'react-native-elements';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { FlatList, Modal, View, TouchableOpacity, } from 'react-native';
import { useLazyGetCategoryListQuery } from '@data/laravel/services/category';
import { CategoryListResponse, HomeCategory, MinimalCategory, PaginationQueryParams } from '@src/types';

export default function CategorySelectionModal({ open, onClose, onSelect, initialValue }: { open: boolean; onClose: () => void, onSelect: (category: MinimalCategory) => void, initialValue: string | number | null }) {
  const [trigger, { isLoading, isFetching }] = useLazyGetCategoryListQuery();
  const actionCreaterRef = React.useRef<ReturnType<typeof trigger> | null>(null);
  const [categoryId, setCategoryId] = React.useState<string | number | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<HomeCategory | null>(null)
  const [categoryPages, setCategoryPages] = React.useState<Array<CategoryListResponse["items"]>>([]);

  React.useEffect(() => {
    setCategoryId(initialValue)
  }, [initialValue])


  React.useEffect(() => {
    const actionCreator: ReturnType<typeof trigger> = trigger({}, true);

    (async () => {
      // setIsFilterProductsLoading(true)
      try {
        const allCategoryResponse = await actionCreator.unwrap()

        setCategoryPages(() => {


          return [allCategoryResponse.items]
        })
      } finally {
        // setIsFilterProductsLoading(false)
      }
    })()

    return () => {

      actionCreator.abort()
    }
  }, [trigger])

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {

        actionCreaterRef.current.abort()
      }
    }
  }, [])

  const categories = React.useMemo(() => {
    if (isLoading) {
      return [{
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
    }

    return categoryPages.flatMap(categoryPage => categoryPage.data.map(catgegory => ({
      type: "data" as const,
      ...catgegory
    })))

  }, [isLoading, categoryPages])

  const getNextCategories = async () => {
    if (isFetching) {
      return;
    }

    const lastProductPage = categoryPages[categoryPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {}

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = trigger(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setCategoryPages(prevPages => {


        return prevPages.concat(productResponse.items)
      })
    } finally {
      // setIsFilterProductsLoading(false)
    }
  }

  return (
    <Modal visible={open} animationType={'slide'}>
      <View style={{ padding: 15 }}>
        <Title>Select Categories</Title>
      </View>


      <FlatList<typeof categories[0]>
        data={categories}
        ItemSeparatorComponent={Divider}
        onEndReached={getNextCategories}
        renderItem={({ item }) => {
          if (item.type === "skeleton") {
            return (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item />
              </SkeletonPlaceholder>
            )
          }


          return (
            // @ts-ignore
            <ListItem
              Component={TouchableOpacity}
            >
              <ListItem.CheckBox
                title={item.title}
                checked={categoryId === item.id}
                containerStyle={{
                  padding: 0,
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                onPress={() => {
                  setCategoryId(item.id)
                  setSelectedCategory(item)
                  // onSelect(item)
                }}
                iconType={'material'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
              />
            </ListItem>

          )
        }}
      />

      <View style={{ marginTop: 15 }}>
        <AppPrimaryButton
          onPress={() => {
            if (selectedCategory) {
              onSelect(selectedCategory)
            }

            onClose();
          }}
          text={'Save'}
        />

        <Button
          onPress={onClose}
          title={'Close'}
          type={'clear'}
          containerStyle={{
            width: 270,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginVertical: 15,
            marginBottom: 30,
          }}
        />
      </View>
    </Modal>
  );
}
