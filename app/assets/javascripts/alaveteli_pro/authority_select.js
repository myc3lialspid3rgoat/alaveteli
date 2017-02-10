(function($){
  $(function(){
    var $select = $('.js-authority-select');
    var $message = $('.js-outgoing-message-body');
    var searchUrl = $select.data('search-url');
    var initialOptions = [];
    var initialAuthority;
    if($select.data('initial-authority').id) {
      initialAuthority = $select.data('initial-authority');
      initialOptions = [initialAuthority];
    }
    var defaultAuthorityName = $message.data('salutation-body-name');
    var salutationTemplate = $message.data('salutation-template');

    var currentAuthorityName = defaultAuthorityName;
    if (initialAuthority) {
      currentAuthorityName = initialAuthority.name;
    }

    var updateSalutation = function updateSalutation(value, $item) {
      var oldAuthorityName = currentAuthorityName;
      var oldSalutation = salutationTemplate.replace(defaultAuthorityName, oldAuthorityName);
      var oldMessage = $message.val();

      var newAuthorityName = $item.text();
      var newSalutation = salutationTemplate.replace(defaultAuthorityName, newAuthorityName);
      var newMessage = oldMessage.replace(oldSalutation, newSalutation);

      $message.val(newMessage);
      currentAuthorityName = newAuthorityName;
    };

    $select.selectize({
      valueField: 'id',
      labelField: 'name',
      searchField: ['name', 'notes'],
      sortField: ['weight'],
      options: initialOptions,
      create: false,
      maxItems: 1,
      render: {
        option: function(body, escape) {
          // No need to use escape because data is trusted (from our DB)
          var html = '<div class="recipient-result">';
          html += '<h4 class="name">' + body.name + '</h4>';
          html += '<p class="description">' + body.notes + '</p>';
          html += '<p class="requests">' + body.info_requests_visible_count + ' requests made</p>';
          html += '</div>';
          return html;
        }
      },
      onItemAdd: updateSalutation,
      load: function(query, callback) {
        if (!query.length) return callback();
        $.getJSON(
            searchUrl + '/' + encodeURIComponent(query),
            callback
          ).fail(callback);
      }
    });
  });
})(window.jQuery);